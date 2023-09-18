using AutoMapper;
using Microsoft.Extensions.Hosting;
using Projekat.Interfaces;
using Projekat.Models;

namespace Projekat.Repository
{
    public class UserRepo
    {
        private readonly DataContext _dataContext;
        public UserRepo(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public User FindByEmail(string email)
        {
            return _dataContext.Users.First(x => x.Email == email);
        }

        public User GetById(long id)
        {
            return _dataContext.Users.Find(id);
        }

        public void Add(User user)
        {
            _dataContext.Users.Add(user);
        }

        public List<User> GetAll()
        {
            return _dataContext.Users.ToList().FindAll(x => x.Type != UserType.ADMIN);
        }

        public User UpdateUser(long id, User noviUser)
        {
            User userDB = GetById(id);

            userDB.Email = noviUser.Email;
            userDB.Password = noviUser.Password;
            userDB.Name = noviUser.Name;
            userDB.Surname = noviUser.Surname;
            userDB.Username = noviUser.Username;
            userDB.Date = noviUser.Date;
            userDB.Address = noviUser.Address;
            userDB.Picture = noviUser.Picture;

            Save();
            return userDB;
        }

        public void Save()
        {
            _dataContext.SaveChanges();
        }
    }
}
