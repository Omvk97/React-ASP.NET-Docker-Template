using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Contracts;
using API.Data.Repositories.TestRepo;
using API.DTOs.OutputDTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;
        private readonly ITestRepo _repo;

        public TestController(ILogger<TestController> logger, ITestRepo repo)
        {
            _logger = logger;
            _repo = repo;
        }

        [HttpGet(Contracts.APIRoutes.TestRoutes.TestGet)]
        public async Task<ActionResult> TestGet()
        {
            await Task.Delay(1000);

            return StatusCode(StatusCodes.Status200OK, new GenericReturnMessageDTO
            {
                StatusCode = 200,
                    Message = SuccessMessages.TemplateTooGood,
            });
        }
    }
}
