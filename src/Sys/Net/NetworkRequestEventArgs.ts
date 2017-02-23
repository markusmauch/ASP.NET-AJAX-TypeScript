
module Sys.Net
{
    export class NetworkRequestEventArgs extends Sys.EventArgs // TODO Sys.CancelEventArgs
    {
        constructor( private _webRequest: WebRequest )
        {
            super();
        }

        public get_webRequest()
        {
            return this._webRequest;
        }
    }
}