using AutoMapper;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Projekat.Dto;
using Projekat.Interfaces;
using Projekat.Models;
using Projekat.Repository;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Projekat.Services
{
    public class UserService : IUserService
    {
        private readonly IMapper _mapper;
        private readonly IWebHostEnvironment _hostEnvironment;
        private readonly IVerificationService _verificationService;
        private readonly UserRepo _userRepo;

        private string SecretKey { get; set; }

        public UserService(IMapper mapper, UserRepo userRepo, IWebHostEnvironment hostEnvironment, IConfiguration config, IVerificationService verificationService)
        {
            _mapper = mapper;
            _userRepo = userRepo;
            _hostEnvironment = hostEnvironment;
            SecretKey = config.GetSection("Authentication:SecretKey").Value;
            _verificationService = verificationService;
        }

        public UserRegisterDto AddUser(UserRegisterDto account)
        {
            User user = _mapper.Map<User>(account);

            try
            {
                if ( _userRepo.FindByEmail(account.Email) != null)
                    return null;
            }
            catch (Exception ex)
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
                _userRepo.Add(user);
                _userRepo.Save();

                if(user.Type == UserType.SELLER)
                    _verificationService.CreateVerification(user.Id);
            }
            return _mapper.Map<UserRegisterDto>(user);

        }

        public string LoginUser(UserLoginDto account)
        {
            User user;
            try
            {
                user = _userRepo.FindByEmail(account.Email);

                if (BCrypt.Net.BCrypt.Verify(account.Password, user.Password))//Uporedjujemo hes pasvorda iz baze i unetog pasvorda
                {
                    List<Claim> claims = new List<Claim>();
                    //Mozemo dodati Claimove u token, oni ce biti vidljivi u tokenu i mozemo ih koristiti za autorizaciju
                    if (user.Type == UserType.ADMIN)
                        claims.Add(new Claim(ClaimTypes.Role, "admin")); //Add user type to claim
                    if (user.Type == UserType.BUYER)
                        claims.Add(new Claim(ClaimTypes.Role, "kupac")); //Add user type to claim
                    if (user.Type == UserType.SELLER)
                        claims.Add(new Claim(ClaimTypes.Role, "prodavac")); //Add user type to claim

                    //Kreiramo kredencijale za potpisivanje tokena. Token mora biti potpisan privatnim kljucem
                    //kako bi se sprecile njegove neovlascene izmene
                    SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
                    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                    var tokeOptions = new JwtSecurityToken(
                        issuer: "http://localhost:7194", //url servera koji je izdao token
                        claims: claims, //claimovi
                        expires: DateTime.Now.AddMinutes(20), //vazenje tokena u minutama
                        signingCredentials: signinCredentials //kredencijali za potpis
                    );
                    string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                    return tokenString;
                }
                else
                {
                    return null;
                }
            }
            catch(Exception e)
            {
                return null;
            }
      
        }

        public UserRegisterDto GetByEmail(string email)
        {
            try
            {
                return _mapper.Map<UserRegisterDto>(_userRepo.FindByEmail(email));
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<UserRegisterDto> GetAll()
        {
            try
            {
                return _mapper.Map<List<UserRegisterDto>>(_userRepo.GetAll());
            }
            catch (Exception)
            {
                return null;
            }
        }

        public UserRegisterDto GetUserById(long id)
        {
            try
            {
                return _mapper.Map<UserRegisterDto>(_userRepo.GetById(id));

            }
            catch (Exception)
            {
                return null;
            }
        }

        public UserRegisterDto UpdateUser(long id, UserRegisterDto newUser)
        {
            User noviUser = _mapper.Map<User>(newUser);

            noviUser.Password = BCrypt.Net.BCrypt.HashPassword(noviUser.Password);
            User userDB = _userRepo.UpdateUser(id, noviUser);

            return _mapper.Map<UserRegisterDto>(userDB);
        }

        public string LoginGoogle(UserRegisterDto account)
        {
            User user;
            try
            {
                user = _userRepo.FindByEmail(account.Email);

                List<Claim> claims = new List<Claim>();

                if (user.Type == UserType.BUYER)
                    claims.Add(new Claim(ClaimTypes.Role, "kupac")); //Add user type to claim
                if (user.Type == UserType.SELLER)
                    claims.Add(new Claim(ClaimTypes.Role, "prodavac")); //Add user type to claim

                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:7194",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return tokenString;
            }
            catch(Exception ex)
            {
                User newUser = _mapper.Map<User>(account);
                newUser.Type = UserType.BUYER;
                _userRepo.Add(newUser);
                _userRepo.Save();

                List<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.Role, "kupac"));

                SymmetricSecurityKey secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey));
                var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
                var tokeOptions = new JwtSecurityToken(
                    issuer: "http://localhost:7194",
                    claims: claims,
                    expires: DateTime.Now.AddMinutes(20),
                    signingCredentials: signinCredentials
                );
                string tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
                return tokenString;
            }
        }
    }
}
