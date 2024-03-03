using AmazeCare.Contexts;
using AmazeCare.Interfaces;
using AmazeCare.Models;
using Microsoft.EntityFrameworkCore;

namespace AmazeCare.Repositories
{
    public class UserRepository : IRepository<string, User>
    {
        private readonly RequestTrackerContext _context;

        /// <summary>
        /// Initializes a new instance of the UserRepository class with the specified database context.
        /// </summary>
        /// <param name="context">The database context.</param>

        public UserRepository(RequestTrackerContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Adds a new user to the database.
        /// </summary>
        /// <param name="item">The user to add.</param>
        /// <returns>The added user.</returns>

        public async Task<User> Add(User item)
        {
            _context.Add(item);
            _context.SaveChanges();
            return item;
        }

        /// <summary>
        /// Deletes a user from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the user to delete.</param>
        /// <returns>The deleted user, or null if the user was not found.</returns>

        public async Task<User> Delete(string key)
        {
            var user = await GetAsync(key);
            if (user != null)
            {
                _context.Remove(user);
                _context.SaveChanges();
                return user;
            }
            return null;
        }

        /// <summary>
        /// Retrieves a user from the database based on the specified key.
        /// </summary>
        /// <param name="key">The key of the user to retrieve.</param>
        /// <returns>The retrieved user, or null if the user was not found.</returns>

        public async Task<User> GetAsync(string key)
        {
            var user = _context.Users.SingleOrDefault(u => u.Username == key);
            return user;
        }

        /// <summary>
        /// Retrieves all users from the database.
        /// </summary>
        /// <returns>A list of all users.</returns>

        public async Task<List<User>> GetAsync()
        {
            var users = await _context.Users.ToListAsync();
            return users;
        }

        /// <summary>
        /// Updates the information of a user in the database.
        /// </summary>
        /// <param name="item">The user object with updated information.</param>
        /// <returns>The updated user, or null if the user was not found.</returns>

        public async Task<User> Update(User item)
        {
            var user = await GetAsync(item.Username);
            if (user != null)
            {
                _context.Entry<User>(item).State = EntityState.Modified;
                _context.SaveChanges();
                return item;
            }
            return null;
        }
    }
}
