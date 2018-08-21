using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace WindowsFormsApplication1
{
    public partial class Form1 : Form
    {
        string CurrentClipBoard = null;
        string OldClipBoard = null;
        bool ctrlDown = false;
        bool itsME = false;

        public Form1()
        {
            InitializeComponent();
            RegisterClipboardViewer();
            this.Visible = false;
            toolStripMenuItem1.Enabled = false;
            toolStripMenuItem2.Enabled = true;
        }

        #region Clipboard-Monitor
        #region Fields
        IntPtr _ClipboardViewerNext;
        #endregion

        #region Methods

        /// <summary>
        /// Register this form as a Clipboard Viewer application
        /// </summary>
        private void RegisterClipboardViewer()
        {
            _ClipboardViewerNext = RAD.ClipMon.Win32.User32.SetClipboardViewer(this.Handle);
        }

        /// <summary>
        /// Remove this form from the Clipboard Viewer list
        /// </summary>
        private void UnregisterClipboardViewer()
        {
            RAD.ClipMon.Win32.User32.ChangeClipboardChain(this.Handle, _ClipboardViewerNext);
        }

        /// <summary>
        /// Search the clipboard contents for hyperlinks and unc paths, etc
        /// </summary>
        /// <param name="iData">The current clipboard contents</param>
        /// <returns>true if new links were found, false otherwise</returns>        
        
        #endregion
        #endregion
        protected override void WndProc(ref Message m)
        {
            switch ((RAD.ClipMon.Win32.Msgs)m.Msg)
            {
                //
                // The WM_DRAWCLIPBOARD message is sent to the first window 
                // in the clipboard viewer chain when the content of the 
                // clipboard changes. This enables a clipboard viewer 
                // window to display the new content of the clipboard. 
                //
                case RAD.ClipMon.Win32.Msgs.WM_DRAWCLIPBOARD:

                    if (!itsME)
                    {
                        if (CurrentClipBoard == null)
                        {
                            //CurrentClipBoard = Clipboard.GetDataObject();
                            CurrentClipBoard = (string)Clipboard.GetDataObject().GetData(DataFormats.Text);
                        }
                        else
                        {
                            OldClipBoard = (string)CurrentClipBoard.Clone();

                            CurrentClipBoard = (string)Clipboard.GetDataObject().GetData(DataFormats.Text);
                            //CurrentClipBoard = Clipboard.GetDataObject();
                        }
                    }
                    //GetClipboardData();

                    //
                    // Each window that receives the WM_DRAWCLIPBOARD message 
                    // must call the SendMessage function to pass the message 
                    // on to the next window in the clipboard viewer chain.
                    //
                    RAD.ClipMon.Win32.User32.SendMessage(_ClipboardViewerNext, m.Msg, m.WParam, m.LParam);
                    break;


                //
                // The WM_CHANGECBCHAIN message is sent to the first window 
                // in the clipboard viewer chain when a window is being 
                // removed from the chain. 
                //
                case RAD.ClipMon.Win32.Msgs.WM_CHANGECBCHAIN:
                    // When a clipboard viewer window receives the WM_CHANGECBCHAIN message, 
                    // it should call the SendMessage function to pass the message to the 
                    // next window in the chain, unless the next window is the window 
                    // being removed. In this case, the clipboard viewer should save 
                    // the handle specified by the lParam parameter as the next window in the chain. 

                    //
                    // wParam is the Handle to the window being removed from 
                    // the clipboard viewer chain 
                    // lParam is the Handle to the next window in the chain 
                    // following the window being removed. 
                    if (m.WParam == _ClipboardViewerNext)
                    {
                        // If wParam is the next clipboard viewer then it
                        // is being removed so update pointer to the next
                        // window in the clipboard chain
                        //
                        _ClipboardViewerNext = m.LParam;
                    }
                    else
                    {
                        RAD.ClipMon.Win32.User32.SendMessage(_ClipboardViewerNext, m.Msg, m.WParam, m.LParam);
                    }
                    break;

                default:
                    //
                    // Let the form process the messages that we are
                    // not interested in
                    //
                    base.WndProc(ref m);
                    break;

            }

        }

        //private String GetClipboardData()
        //{
        //    String result = "";
        //    IDataObject iData = new DataObject();

        //    try
        //    {
        //        iData = Clipboard.GetDataObject();
        //    }
        //    catch (System.Runtime.InteropServices.ExternalException ex)
        //    {
        //        // MessageBox.Show(ex.Message);
        //        // Copying a field definition in Access 2002 causes this sometimes?
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {
        //        // MessageBox.Show(ex.ToString());
        //        return result;
        //    }

        //    try
        //    {

        //        // 
        //        // Get RTF if it is present
        //        //
        //        if (iData.GetDataPresent(DataFormats.Rtf))
        //        {
        //            result=(string)iData.GetData(DataFormats.Rtf);

        //            //if (iData.GetDataPresent(DataFormats.Text))
        //            //{
        //            //    // strText = "RTF";
        //            //}
        //        }
        //        else
        //        {
        //            // 
        //            // Get Text if it is present
        //            //
        //            if (iData.GetDataPresent(DataFormats.Text))
        //            {
        //                result = (string)iData.GetData(DataFormats.Text);
        //            }
        //            else
        //            {
        //                //
        //                // Only show RTF or TEXT
        //                //
        //                result = "(cannot display this format)";
        //            }
        //        }
        //    }
        //    catch
        //    {
        //    }
        //}

        private void keylogger1_VKCodeDown(int vkcode)
        {
            //check ctrl
            if (vkcode == 162)
            {
                ctrlDown=true;
            }

            // check "b"
            if (vkcode == 66)
            {
                if (ctrlDown)
                {
                    n7aKeylogger.Keylogger.KLG_Hooks.trapKey = true;

                    itsME = true;
                    if ((OldClipBoard != null) && (CurrentClipBoard != null))
                    {
                        Clipboard.SetDataObject(OldClipBoard);
                        SendKeys.SendWait("^v");
                        Clipboard.SetDataObject(CurrentClipBoard);
                    }
                    itsME = false;

                }

            }
        }

        private void keylogger1_VKCodeUp(int vkcode)
        {
            //check ctrl
            if (vkcode == 162)
            {
                ctrlDown = false;
            }

            // check "b"
            if (vkcode == 66)
            {
                if (ctrlDown)
                {                                      
                    n7aKeylogger.Keylogger.KLG_Hooks.trapKey = false;                    
                }

            }
        }

        private void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            UnregisterClipboardViewer();
        }        

        private void toolStripMenuItem1_Click(object sender, EventArgs e)
        {
            keylogger1.Enabled = true;
            toolStripMenuItem1.Enabled = false;
            toolStripMenuItem2.Enabled = true;
        }

        private void toolStripMenuItem2_Click(object sender, EventArgs e)
        {
            keylogger1.Enabled = false;
            toolStripMenuItem1.Enabled = true;
            toolStripMenuItem2.Enabled = false;
        }

        private void toolStripMenuItem3_Click(object sender, EventArgs e)
        {
            Environment.Exit(0);
        }

        private void Form1_Shown(object sender, EventArgs e)
        {
            this.Visible = false;
        }
    }
}
