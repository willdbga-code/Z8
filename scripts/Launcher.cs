using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace Z8WMSLauncher
{
    static class Program
    {
        [STAThread]
        static void Main()
        {
            string baseDir = AppDomain.CurrentDomain.BaseDirectory;
            
            string[] candidates = new string[]
            {
                Path.Combine(baseDir, "z8-wms", "dist-app", "Z8-WMS-win32-x64", "Z8-WMS.exe"),
                Path.Combine(baseDir, "dist-app", "Z8-WMS-win32-x64", "Z8-WMS.exe"),
                Path.Combine(baseDir, "..", "z8-wms", "dist-app", "Z8-WMS-win32-x64", "Z8-WMS.exe"),
                Path.Combine(baseDir, "Z8-WMS-win32-x64", "Z8-WMS.exe")
            };

            string targetExe = null;
            foreach (string p in candidates)
            {
                try
                {
                    string full = Path.GetFullPath(p);
                    if (File.Exists(full))
                    {
                        targetExe = full;
                        break;
                    }
                }
                catch { }
            }

            try
            {
                if (!string.IsNullOrEmpty(targetExe) && File.Exists(targetExe))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = targetExe,
                        WorkingDirectory = Path.GetDirectoryName(targetExe),
                        UseShellExecute = false
                    };
                    Process.Start(psi);
                }
                else
                {
                    string workingDir = Directory.Exists(Path.Combine(baseDir, "z8-wms")) 
                        ? Path.Combine(baseDir, "z8-wms") 
                        : baseDir;

                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        Arguments = "/c npx electron main.cjs",
                        WorkingDirectory = workingDir,
                        CreateNoWindow = true,
                        UseShellExecute = false
                    };
                    Process.Start(psi);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Erro ao inicializar o Z8 WMS: " + ex.Message, "Z8 WMS Desktop", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
