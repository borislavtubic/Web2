using Projekat.Models;

namespace Projekat.Dto
{
    public class VerificationDto
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public VerificationStatus Status { get; set; }
    }
}
