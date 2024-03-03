using AmazeCare.Contexts;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using AmazeCare.Repositories;
using AmazeCare.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace AmazeCare
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            
            builder.Services.AddSwaggerGen(opt =>
            {
                opt.SwaggerDoc("v1", new OpenApiInfo { Title = "MyAPI", Version = "v1" });
                opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "bearer"
                });

                opt.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type=ReferenceType.SecurityScheme,
                                    Id="Bearer"
                                }
                            },
                            new string[]{}
                        }
                    });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                 .AddJwtBearer(options =>
                 {
                     options.TokenValidationParameters = new TokenValidationParameters
                     {
                         ValidateIssuerSigningKey = true,
                         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["SecretKey"])),
                         ValidateIssuer = false,
                         ValidateAudience = false,
                         ValidateLifetime = true,
                         ValidIssuer = builder.Configuration["IdentityServer4:Authority"],
                         ValidAudience = builder.Configuration["IdentityServer4:Audience"]

                     };
                 });




            

            builder.Services.AddDbContext<RequestTrackerContext>(opts =>
            {
                opts.UseSqlServer(builder.Configuration.GetConnectionString("requestTrackerConnection"));
            });
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("ReactPolicy", opts =>
                {
                    opts.WithOrigins("http://localhost:3000").AllowAnyMethod().AllowAnyHeader();
                });
            });

            builder.Services.AddScoped<IRepository<int, Patients>, PatientRepository>();
            builder.Services.AddScoped<IRepository<int, Doctors>, DoctorRepository>();
            builder.Services.AddScoped<IRepository<int, Appointments>, AppointmentRepository>();
            builder.Services.AddScoped<IRepository<int, MedicalRecords>, MedicalRecordRepository>();
            builder.Services.AddScoped<IRepository<int, Prescriptions>, PrescriptionRepository>();
            builder.Services.AddScoped<IPrescriptionRepository, PrescriptionRepository>();
            builder.Services.AddScoped<IRepository<string, User>, UserRepository>();

           
            
            builder.Services.AddScoped<IDoctorAdminService, DoctorService>();
            builder.Services.AddScoped<IPatientAdminService, PatientService>();
            builder.Services.AddScoped<IAppointmentAdminService, AppointmentService>();
            builder.Services.AddScoped<IDoctorUserService, DoctorService>();
            builder.Services.AddScoped<IPatientUserService, PatientService>();
            builder.Services.AddScoped<IAppointmentUserService, AppointmentService>();
            builder.Services.AddScoped<IMedicalRecordService, MedicalRecordService>();
            builder.Services.AddScoped<IPrescriptionService, PrescriptionService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<ITokenService, TokenService>();



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors();
            app.UseAuthentication();
            app.UseAuthorization();




            app.MapControllers();

            app.Run();
        }
    }
}
