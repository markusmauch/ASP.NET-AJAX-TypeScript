module Sys.Net
{
    export class XMLHttpExecutor extends WebRequestExecutor
    {
        private _xmlHttpRequest: XMLHttpRequest;
        private _webRequest: WebRequest;
        private _responseAvailable = false;
        private _timedOut = false;
        private _timer: number;
        private _aborted = false;
        private _started = false;

        constructor()
        {
            super();
        }

        public get_started()
        {
            return this._started;
        }

        public get_responseAvailable()
        {
            return this._responseAvailable;
        }

        public get_timedOut()
        {
            return this._timedOut;
        }

        public get_aborted()
        {
            return this._aborted;
        }

        public get_responseData()
        {
            if ( this._responseAvailable )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallBeforeResponse, 'get_responseData' ) );
            }
            if ( !this._xmlHttpRequest )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallOutsideHandler, 'get_responseData' ) );
            }
            return this._xmlHttpRequest.responseText;
        }

        public get_statusCode()
        {
            if ( !this._responseAvailable )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallBeforeResponse, 'get_statusCode' ) );
            }
            if ( !this._xmlHttpRequest )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallOutsideHandler, 'get_statusCode' ) );
            }
            var result = 0;
            try
            {
                result = this._xmlHttpRequest.status;
            }
            catch ( ex )
            {}
            return result;
        }

        public get_statusText()
        {
            if ( !this._responseAvailable )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallBeforeResponse, 'get_statusText' ) );
            }
            if ( !this._xmlHttpRequest )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallOutsideHandler, 'get_statusText' ) );
            }
            return this._xmlHttpRequest.statusText;
        }

        public get_xml()
        {
            if ( !this._responseAvailable )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallBeforeResponse, 'get_xml' ) );
            }
            if ( !this._xmlHttpRequest )
            {
                throw Error.invalidOperation( String.format( Sys.Res.cannotCallOutsideHandler, 'get_xml' ) );
            }
            var xml = this._xmlHttpRequest.responseXML;
            if ( !xml || !xml.documentElement )
            {
                xml = Sys.Net.XMLDOM( this._xmlHttpRequest.responseText );
                if ( !xml || !xml.documentElement )
                    return null;
            }
            else if ( navigator.userAgent.indexOf( 'MSIE' ) !== -1 )
            {
                xml.setProperty( 'SelectionLanguage', 'XPath' );
            }
            if ( xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
                xml.documentElement.tagName === "parsererror" )
            {
                return null;
            }

            if ( xml.documentElement.firstChild && xml.documentElement.firstChild.tagName === "parsererror" )
            {
                return null;
            }

            return xml;
        }

        private _onReadyStateChange()
        {
            if ( this._xmlHttpRequest.readyState === 4 )
            {
                try
                {
                    if ( typeof( this._xmlHttpRequest.status ) === "undefined" )
                    {
                        return;
                    }
                }
                catch ( ex )
                {
                    return;
                }

                this._clearTimer();
                this._responseAvailable = true;
                this._webRequest.completed( Sys.EventArgs.Empty );
                if ( this._xmlHttpRequest !== undefined )
                {
                    this._xmlHttpRequest.onreadystatechange = () =>
                    {};
                    delete this._xmlHttpRequest;
                }
            }
        }

        private _clearTimer()
        {
            if ( this._timer !== undefined )
            {
                window.clearTimeout( this._timer );
                delete this._timer;
            }
        }

        private _onTimeout()
        {
            if ( this._timer !== undefined )
            {
                window.clearTimeout( this._timer );
                delete this._timer;
            }
        }
    }
}