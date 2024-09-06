using AutoMapper;
using Metadata;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Diagnostics;

namespace IdService
{
    internal static class Program
    {
        private static void Main()
        {
            try
            {
                ServiceCollection? serviceCollection = new ServiceCollection();
                serviceCollection.AddAutoMapper(typeof(EFDatabaseMappers));
                ServiceProvider provider = serviceCollection.BuildServiceProvider();
                ServiceRuntime.RegisterServiceAsync("IdServiceType",
                    context => new IdService(context, provider.GetRequiredService<IMapper>())).GetAwaiter().GetResult();

                ServiceEventSource.Current.ServiceTypeRegistered(Process.GetCurrentProcess().Id, typeof(IdService).Name);

                Thread.Sleep(Timeout.Infinite);
            }
            catch (Exception e)
            {
                ServiceEventSource.Current.ServiceHostInitializationFailed(e.ToString());
                throw;
            }
        }
    }
}
