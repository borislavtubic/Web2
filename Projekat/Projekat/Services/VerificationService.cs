using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using Projekat.Repository;

namespace Projekat.Services
{
    public class VerificationService : IVerificationService
    {

        private readonly IMapper _mapper;
        private readonly VerificationRepo _verificationRepo;

        public VerificationService(IMapper mapper, VerificationRepo verificationRepo)
        {
            _mapper = mapper;
            _verificationRepo = verificationRepo;
        }

        public VerificationDto CreateVerification(long userId)
        {
            Verification verification = new Verification();
            verification.UserId = userId;
            verification.Status = VerificationStatus.IN_PROCESS;
            _verificationRepo.Add(verification);
            _verificationRepo.Save();

            return _mapper.Map<VerificationDto>(verification);
        }

        public List<VerificationDto> GetAll()
        {
            try
            {
                return _mapper.Map<List<VerificationDto>>(_verificationRepo.GetAll());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public VerificationDto GetByUserId(long userId)
        {
            try
            {
                return _mapper.Map<VerificationDto>(_verificationRepo.Get(userId));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public VerificationDto UpdateVerification(long id, VerificationDto newVerification)
        {
            try
            {
                Verification noviUser = _mapper.Map<Verification>(newVerification);
                Verification verificationDB = _verificationRepo.Get(id);

                verificationDB.Status = noviUser.Status;
                _verificationRepo.Save();

                return _mapper.Map<VerificationDto>(verificationDB);
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}
