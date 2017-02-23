
module Sys.Net
{
    export class WebRequest
    {
        private _url = "";
        private _headers = { };
        private _body = null;
        private _userContext = null;
        private _httpVerb = null;
        private _executor: WebRequestExecutor;
        private _invokeCalled = false;
        private _timeout = 0;

        private _events = new EventHandlerList();

        public add_completed( handler: EventHandler )
        {
            this._get_eventHandlerList().addHandler( "completed", handler );
        }

        public remove_completed( handler: EventHandler )
        {
            this._get_eventHandlerList().removeHandler( "completed", handler );
        }
        
        public completed( eventArgs )
        {
            let handler = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler("completedRequest");
            if ( handler )
            {
                handler( this._executor, eventArgs );
            }
            handler = this._get_eventHandlerList().getHandler("completed");
            if ( handler )
            {
                handler( this._executor, eventArgs );
            }
        }

        public _get_eventHandlerList()
        {
            if ( !this._events )
            {
                this._events = new Sys.EventHandlerList();
            }
            return this._events;
        }

        public get_url()
        {
            return this._url;
        }

        public set_url(value)
        {
            this._url = value;
        }

        public get_headers()
        {
            return this._headers;
        }

        public get_httpVerb()
        {
            if ( this._httpVerb === null )
            {
                if ( this._body === null )
                {
                    return "GET";
                }
                return "POST";
            }
            return this._httpVerb;
        }

        public set_httpVerb(value)
        {
            this._httpVerb = value;
        }
        public get_body()
        {
            return this._body;
        }

        public set_body(value)
        {
            this._body = value;
        }

        public get_userContext()
        {
            return this._userContext;
        }
        
        public set_userContext(value)
        {
            this._userContext = value;
        }

        public get_executor()
        {
            return this._executor;
        }

        public set_executor(value)
        {
            if ( this._executor !== null && this._executor.get_started() )
            {
                throw Error.invalidOperation(Sys.Res.setExecutorAfterActive);
            }
            this._executor = value;
            this._executor._set_webRequest( this );
        }
        
        public get_timeout()
        {
            if ( this._timeout === 0 )
            {
                return Sys.Net.WebRequestManager.get_defaultTimeout();
            }
            return this._timeout;
        }
        
        public set_timeout( value )
        {
            if ( value < 0 )
            {
                throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
            }
            this._timeout = value;
        }

        public getResolvedUrl()
        {
            return Sys.Net.WebRequest._resolveUrl( this._url );
        }

        public invoke()
        {
            if (this._invokeCalled) {
                throw Error.invalidOperation(Sys.Res.invokeCalledTwice);
            }
            Sys.Net.WebRequestManager.executeRequest( this );
            this._invokeCalled = true;
        }

        private _resolveUrl(url, baseUrl)
        {
            if (url && url.indexOf('://') !== -1) {
                return url;
            }
            if (!baseUrl || baseUrl.length === 0) {
                var baseElement = document.getElementsByTagName('base')[0];
                if (baseElement && baseElement.href && baseElement.href.length > 0) {
                    baseUrl = baseElement.href;
                }
                else {
                    baseUrl = document.URL;
                }
            }
            var qsStart = baseUrl.indexOf('?');
            if (qsStart !== -1) {
                baseUrl = baseUrl.substr(0, qsStart);
            }
            qsStart = baseUrl.indexOf('#');
            if (qsStart !== -1) {
                baseUrl = baseUrl.substr(0, qsStart);
            }
            baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);
            if (!url || url.length === 0) {
                return baseUrl;
            }
            if (url.charAt(0) === '/') {
                var slashslash = baseUrl.indexOf('://');
                if (slashslash === -1) {
                    throw Error.argument("baseUrl", Sys.Res.badBaseUrl1);
                }
                var nextSlash = baseUrl.indexOf('/', slashslash + 3);
                if (nextSlash === -1) {
                    throw Error.argument("baseUrl", Sys.Res.badBaseUrl2);
                }
                return baseUrl.substr(0, nextSlash) + url;
            }
            else {
                var lastSlash = baseUrl.lastIndexOf('/');
                if (lastSlash === -1) {
                    throw Error.argument("baseUrl", Sys.Res.badBaseUrl3);
                }
                return baseUrl.substr(0, lastSlash+1) + url;
            }
        }

        public _createQueryString( queryString, encodeMethod, addParams )
        {
            encodeMethod = encodeMethod || encodeURIComponent;
            var i = 0, obj, val, arg, sb = new Sys.StringBuilder();
            if (queryString) {
                for (arg in queryString) {
                    obj = queryString[arg];
                    if (typeof(obj) === "function") continue;
                    val = Sys.Serialization.JavaScriptSerializer.serialize(obj);
                    if (i++) {
                        sb.append('&');
                    }
                    sb.append(arg);
                    sb.append('=');
                    sb.append(encodeMethod(val));
                }
            }
            if (addParams) {
                if (i) {
                    sb.append('&');
                }
                sb.append(addParams);
            }
            return sb.toString();
        }
    }
}