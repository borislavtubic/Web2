using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Services;
using System.Data;

namespace Projekat.Controllers
{
    [Route("api/verifications")]
    [ApiController]
    public class VerificationController : ControllerBase
    {
        private readonly IVerificationService _verificationService;

        public VerificationController(IVerificationService verificationService)
        {
            _verificationService = verificationService;
        }

        [HttpGet("{userId}")]
        [Authorize(Roles = "admin,prodavac")]
        public IActionResult GetVerification(long userId)
        {
            VerificationDto verificationDto = _verificationService.GetByUserId(userId);
            if (verificationDto == null)
            {
                return BadRequest("Desila se greska prilikom preuzimanja verifikacije!");
            }
            return Ok(verificationDto);
        }

        [HttpGet("all")]
        [Authorize(Roles = "admin")]
        public IActionResult GetAll()
        {
            List<VerificationDto> verifications = new List<VerificationDto>();
            verifications = _verificationService.GetAll();
            if (verifications == null)
            {
                return BadRequest("Desila se greska prilikom preuzimanja svih verifikacija!");
            }
            return Ok(verifications);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public IActionResult UpdateVerification(long id, [FromBody] VerificationDto verificationDto)
        {
            VerificationDto verification = _verificationService.UpdateVerification(id, verificationDto);
            if(verification == null)
                return BadRequest("Desila se greska prilikom izmjene verifikacije!");
            return Ok(verification);
        }
    }
}
