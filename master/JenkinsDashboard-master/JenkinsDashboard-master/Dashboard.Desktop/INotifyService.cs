namespace Dashboard.Desktop
{
    internal interface INotifyService
    {
        void Notify(string message);

        void Notify(string title, string message);

        void ChangeIconSource(string path);
    }
}