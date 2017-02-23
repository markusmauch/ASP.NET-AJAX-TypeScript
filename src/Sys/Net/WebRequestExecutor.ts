
module Sys.Net
{
    export class WebRequestExecutor
    {
        private _webRequest: WebRequest = null;
        private _resultObject = null;

        public get_webRequest()
        {
            return this._webRequest;
        }

        public _set_webRequest( value: WebRequest )
        {
            this._webRequest = value;
        }

        public get_started()
        {
            throw Error.notImplemented();
        }

        public get_responseAvailable()
        {
            throw Error.notImplemented();
        }

        public get_timedOut()
        {
            throw Error.notImplemented();
        }

        public get_aborted()
        {
            throw Error.notImplemented();
        }

        public get_responseData()
        {
            throw Error.notImplemented();
        }

        public get_statusCode()
        {
            throw Error.notImplemented();
        }

        public get_statusText()
        {
            throw Error.notImplemented();
        }

        public get_xml()
        {
            throw Error.notImplemented();
        }

        public get_object()
        {
            if ( !this._resultObject )
            {
                this._resultObject = null; // TODO Sys.Serialization.JavaScriptSerializer.deserialize( this.get_responseData() );
            }
            return this._resultObject;
        }
    }
}