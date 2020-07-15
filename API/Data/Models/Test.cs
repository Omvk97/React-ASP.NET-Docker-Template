using System;
using System.ComponentModel.DataAnnotations;

namespace API.Data.Models
{
    public class Test
    {
        public Guid Id { get; set; }
        [Required]
        public string Name { get; set; }
    }
}