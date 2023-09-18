namespace Projekat.Models
{
    public enum VerificationStatus
    {
        IN_PROCESS = 0, ACCEPTED = 1, DENIED = 2
    }
    public class Verification
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public VerificationStatus Status { get; set; }
    }
}
