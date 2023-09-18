using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IVerificationService
    {
        VerificationDto CreateVerification(long userId);
        VerificationDto GetByUserId(long userId);
        List<VerificationDto> GetAll();
        VerificationDto UpdateVerification(long id, VerificationDto newVerification);
    }
}
