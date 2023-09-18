using Projekat.Dto;

namespace Projekat.Interfaces
{
    public interface IUserService
    {
        UserRegisterDto AddUser(UserRegisterDto account);
        string LoginUser(UserLoginDto account);
        string LoginGoogle(UserRegisterDto account);
        UserRegisterDto GetByEmail(string email);
        List<UserRegisterDto> GetAll();
        UserRegisterDto UpdateUser(long id, UserRegisterDto account);
        UserRegisterDto GetUserById(long id);
    }
}
