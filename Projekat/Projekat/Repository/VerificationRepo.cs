using Projekat.Models;

namespace Projekat.Repository
{
    public class VerificationRepo
    {
        private readonly DataContext _dataContext;
        public VerificationRepo(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public void Add(Verification verification)
        {
            _dataContext.Verifications.Add(verification);
        }

        public List<Verification> GetAll()
        {
            return _dataContext.Verifications.ToList();
        }

        public Verification Get(long id)
        {
            return _dataContext.Verifications.First(x => x.UserId == id);
        }

        public void Save()
        {
            _dataContext.SaveChanges();
        }
    }
}
