using MailKit.Security;
using MimeKit;
using System.Security.Cryptography;
using System.Text;

namespace Metadata
{
    public class Tools
    {
        public static string IToolPasswordHash(string password)
        {
            byte[] hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashBytes);
        }

        public async static Task<string> IToolHttpClient(string url)
        {
            string path = "C:/webserver/" + Guid.NewGuid().ToString() + ".jpg";
            using var httpClient = new HttpClient();
            Directory.CreateDirectory(path.Split(".")[0]);
            await File.WriteAllBytesAsync(path, await httpClient.GetByteArrayAsync(url));

            return Path.GetFullPath(path);
        }

        public async static Task<string> IToolImageMedia(string image)
        {
            string path = "C:/webserver/" + Guid.NewGuid().ToString() + "." + image.Split(',')[0].Split(';')[0].Split('/')[1];
            Directory.CreateDirectory(path.Split(".")[0]);
            await File.WriteAllBytesAsync(path, Convert.FromBase64String(image.Split(',')[1]));

            return Path.GetFullPath(path);
        }

        public async static Task<string> IToolImageWww(string image)
        {
            byte[] imageBytes = await File.ReadAllBytesAsync(image);
            string base64String = Convert.ToBase64String(imageBytes);
            string extension = Path.GetExtension(image).ToLowerInvariant().Replace(".", "");
            return $"data:image/{extension};base64,{base64String}";
        }

        public static async Task<bool> SendEmailAsync(string toEmail, string verificationCode)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("stankovic.pr48.2020@uns.ac.rs"));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = "WEB2";
                email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = verificationCode };

                using var smtp = new MailKit.Net.Smtp.SmtpClient();
                await smtp.ConnectAsync("smtp.uns.ac.rs", 587, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync("stankovic.pr48.2020@uns.ac.rs", "ftnpassword12#3");
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }
    }
}
