using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Data.Repositories.TestRepo;
using API.DTOs.OutputDTOs;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    // Any origin is allowed
                    builder.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed((host) => true).AllowCredentials();
                });
            });
            services.AddControllers();

            // Custom Error return behavior
            services.Configure<ApiBehaviorOptions>(o =>
            {
                o.InvalidModelStateResponseFactory = actionContext =>
                {
                    List<string> errors = new List<string>();
                    foreach (var value in actionContext.ModelState.Values)
                    {
                        foreach (var error in value.Errors)
                        {
                            errors.Add(error.ErrorMessage);
                        }
                    }
                    if (errors.Count == 1)
                    {
                        return new BadRequestObjectResult(new GenericReturnMessageDTO
                        {
                            StatusCode = 400,
                                Message = errors[0]
                        });
                    }
                    return new BadRequestObjectResult(new GenericReturnMessageDTO
                    {
                        StatusCode = 400,
                            Message = errors
                    });
                };
            });

            Console.ForegroundColor = ConsoleColor.Red;
            // environment variables check
            var connectionString = Environment.GetEnvironmentVariable("POSTGRES_CONNECTION_STRING");
            if (connectionString == null)
            {
                Console.WriteLine("'POSTGRES_CONNECTION_STRING' Database Connection string not found");
                System.Environment.Exit(1);
            }
            Console.ResetColor();

            services.AddDbContext<DataContext>(options =>
            {
                options.UseNpgsql(connectionString, options => options.EnableRetryOnFailure(
                    maxRetryCount: 3,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorCodesToAdd: null
                ));

            });

            // Database repos innjection
            services.AddScoped<ITestRepo, TestRepo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public async void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                logger.LogInformation("Running in development");
            }

            await UpdateDatabase(app, logger);

            app.UseCors();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

        // Ensures an updated database to the latest migration
        private async Task UpdateDatabase(IApplicationBuilder app, ILogger<Startup> logger)
        {
            using(var serviceScope = app.ApplicationServices
                .GetRequiredService<IServiceScopeFactory>()
                .CreateScope())
            {
                using(var context = serviceScope.ServiceProvider.GetService<DataContext>())
                {
                    // Npgsql resiliency strategy does not work with Database.EnsureCreated() and Database.Migrate().
                    // Therefore a retry pattern is implemented for this purpose 
                    // if database connection is not ready it will retry 3 times before finally quiting
                    var retryCount = 3;
                    var currentRetry = 0;
                    while (true)
                    {
                        try
                        {
                            logger.LogInformation("Attempting database migration");

                            context.Database.Migrate();

                            logger.LogInformation("Database migration & connection successful");

                            break; // break if migration is successful
                        }
                        catch (Npgsql.NpgsqlException)
                        {
                            logger.LogError("Database migration failed. Retrying in 5 seconds ...");

                            currentRetry++;

                            if (currentRetry == retryCount) // Here it is possible to check the type of exception if needed with an OR. And exit if it's a specific exception.
                            {
                                // We have tried as many times as retryCount specifies. Now we throw it and exit the application
                                logger.LogCritical($"Database migration failed after {retryCount} retries");
                                throw;
                            }

                        }
                        // Waiting 5 seconds before trying again
                        await Task.Delay(TimeSpan.FromSeconds(5));
                    }

                }
            }
        }
    }
}
