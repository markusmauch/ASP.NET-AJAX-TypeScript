module Sys
{
    export let _jsonp = 0;
}

module Sys.Net
{
    export class WebServiceProxy
    {
        static _xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;

        private _timeout: number;
        private _userContext: any;
        private _succeeded: boolean;
        private _failed: boolean;
        private _path: string;
        private _jsonp: string;
        private _callbackParameter: string;

        public get_timeout()
        {
            return this._timeout || 0;
        }
        public set_timeout( value )
        {
            if ( value < 0 )
            {
                throw Error.argumentOutOfRange( 'value', value, Sys.Res.invalidTimeout );
            }
            this._timeout = value;
        }
        public get_defaultUserContext()
        {
            return ( typeof( this._userContext ) === "undefined" ) ? null : this._userContext;
        }
        public set_defaultUserContext( value )
        {
            this._userContext = value;
        }
        public get_defaultSucceededCallback()
        {
            return this._succeeded || null;
        }
        public set_defaultSucceededCallback( value )
        {
            this._succeeded = value;
        }
        public get_defaultFailedCallback()
        {
            return this._failed || null;
        }
        public set_defaultFailedCallback( value )
        {
            this._failed = value;
        }
        public get_enableJsonp()
        {
            return !!this._jsonp;
        }
        public set_enableJsonp( value )
        {
            this._jsonp = value;
        }
        public get_path()
        {
            return this._path || null;
        }
        public set_path( value )
        {
            this._path = value;
        }
        public get_jsonpCallbackParameter()
        {
            return this._callbackParameter || "callback";
        }
        public set_jsonpCallbackParameter( value )
        {
            this._callbackParameter = value;
        }
        public _invoke( servicePath: string, methodName: string, useGet: boolean, params: any, onSuccess?, onFailure?, userContext? )
        {
            onSuccess = onSuccess || this.get_defaultSucceededCallback();
            onFailure = onFailure || this.get_defaultFailedCallback();
            if ( userContext === null || typeof userContext === 'undefined' ) userContext = this.get_defaultUserContext();
            return Sys.Net.WebServiceProxy.invoke( servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter() );
        }
        
        public static invoke(
            servicePath: string,
            methodName: string,
            useGet = true,
            params?,
            onSuccess?,
            onFailure?,
            userContext?,
            timeout?: number,
            enableJsonp?: boolean,
            jsonpCallbackParameter?: string )
        {
            var schemeHost = ( enableJsonp !== false ) ? Sys.Net.WebServiceProxy._xdomain.exec( servicePath ) : null,
                tempCallback, jsonp = schemeHost && ( schemeHost.length === 3 ) &&
                ( ( schemeHost[ 1 ] !== location.protocol ) || ( schemeHost[ 2 ] !== location.host ) );
            useGet = jsonp || useGet;
            if ( jsonp )
            {
                jsonpCallbackParameter = jsonpCallbackParameter || "callback";
                tempCallback = "_jsonp" + Sys._jsonp++;
            }
            if ( !params ) params = {};
            var urlParams = params;
            if ( !useGet || !urlParams ) urlParams = {};
            let timeoutcookie: number | undefined;
            
            var script, error, 
                loader,
                url = Sys.Net.WebRequest._createUrl( methodName ?
                    ( servicePath + "/" + encodeURIComponent( methodName ) ) :
                    servicePath, urlParams, jsonp ? ( jsonpCallbackParameter + "=Sys." + tempCallback ) : null );
            if ( jsonp || false ) // TODO
            {
                script = document.createElement( "script" );
                script.src = url;
                /*
                loader = new Sys._ScriptLoaderTask( script, function( script, loaded )
                {
                    if ( !loaded || tempCallback )
                    {
                        jsonpComplete(
                        {
                            Message: String.format( Sys.Res.webServiceFailedNoMsg, methodName )
                        }, -1 );
                    }
                } );
                */ //TODO
                let jsonpComplete = function( data, statusCode )
                {
                    if ( timeoutcookie !== undefined )
                    {
                        window.clearTimeout( timeoutcookie );
                        timeoutcookie = undefined;
                    }
                    loader.dispose();
                    delete Sys[ tempCallback ];
                    tempCallback = null;
                    if ( ( typeof( statusCode ) !== "undefined" ) && ( statusCode !== 200 ) )
                    {
                        if ( onFailure )
                        {
                            error = new Sys.Net.WebServiceError( false,
                                data.Message || String.format( Sys.Res.webServiceFailedNoMsg, methodName ),
                                data.StackTrace || null,
                                data.ExceptionType || null,
                                data );
                            error._statusCode = statusCode;
                            onFailure( error, userContext, methodName );
                        }
                        else
                        {
                            if ( data.StackTrace && data.Message )
                            {
                                error = data.StackTrace + "-- " + data.Message;
                            }
                            else
                            {
                                error = data.StackTrace || data.Message;
                            }
                            error = String.format( error ? Sys.Res.webServiceFailed : Sys.Res.webServiceFailedNoMsg, methodName, error );
                            throw Sys.Net.WebServiceProxy._createFailedError( methodName, String.format( Sys.Res.webServiceFailed, methodName, error ) );
                        }
                    }
                    else if ( onSuccess )
                    {
                        onSuccess( data, userContext, methodName );
                    }
                }

                Sys[ tempCallback ] = jsonpComplete;
                loader.execute();
                return null;
            }
            var request = new Sys.Net.WebRequest();
            request.set_url( url );
            request.get_headers()[ 'Content-Type' ] = 'application/json; charset=utf-8';
            
            let body = "";
            if ( !useGet )
            {
                body = Sys.Serialization.JavaScriptSerializer.serialize( params );
                if ( body === "{}" ) body = "";
            }
            request.set_body( body );
            request.add_completed( onComplete );
            if ( timeout && timeout > 0 ) request.set_timeout( timeout );
            request.invoke();

            function onComplete( response, eventArgs )
            {
                if ( response.get_responseAvailable() )
                {
                    var statusCode = response.get_statusCode();
                    let result;

                    try
                    {
                        var contentType = response.getResponseHeader( "Content-Type" );
                        if ( contentType.startsWith( "application/json" ) )
                        {
                            result = response.get_object();
                        }
                        else if ( contentType.startsWith( "text/xml" ) )
                        {
                            result = response.get_xml();
                        }
                        else
                        {
                            result = response.get_responseData();
                        }
                    }
                    catch ( ex )
                    {}
                    var error = response.getResponseHeader( "jsonerror" );
                    var errorObj = ( error === "true" );
                    if ( errorObj )
                    {
                        if ( result !== undefined )
                        {
                            let err = result as any;
                            result = new Sys.Net.WebServiceError( false, err.Message, err.StackTrace, err.ExceptionType, result );
                        }
                    }
                    else if ( contentType.startsWith( "application/json" ) )
                    {
                        result = ( !result || ( result.d === undefined ) ) ? result : result.d;
                    }
                    if ( ( ( statusCode < 200 ) || ( statusCode >= 300 ) ) || errorObj )
                    {
                        if ( onFailure )
                        {
                            if ( !result || !errorObj )
                            {
                                result = new Sys.Net.WebServiceError( false, String.format( Sys.Res.webServiceFailedNoMsg, methodName ) );
                            }
                            result._statusCode = statusCode;
                            onFailure( result, userContext, methodName );
                        }
                        else
                        {
                            if ( result && errorObj )
                            {
                                error = result.get_exceptionType() + "-- " + result.get_message();
                            }
                            else
                            {
                                error = response.get_responseData();
                            }
                            throw Sys.Net.WebServiceProxy._createFailedError( methodName, String.format( Sys.Res.webServiceFailed, methodName, error ) );
                        }
                    }
                    else if ( onSuccess )
                    {
                        onSuccess( result, userContext, methodName );
                    }
                }
                else
                {
                    var msg;
                    if ( response.get_timedOut() )
                    {
                        msg = String.format( Sys.Res.webServiceTimedOut, methodName );
                    }
                    else
                    {
                        msg = String.format( Sys.Res.webServiceFailedNoMsg, methodName )
                    }
                    if ( onFailure )
                    {
                        onFailure( new Sys.Net.WebServiceError( response.get_timedOut(), msg, "", "" ), userContext, methodName );
                    }
                    else
                    {
                        throw Sys.Net.WebServiceProxy._createFailedError( methodName, msg );
                    }
                }
            }
            return request;
        }

        public static _createFailedError( methodName, errorMessage )
        {
            var displayMessage = "Sys.Net.WebServiceFailedException: " + errorMessage;
            var e = Error.create( displayMessage,
            {
                'name': 'Sys.Net.WebServiceFailedException',
                'methodName': methodName
            } );
            e.popStackFrame();
            return e;
        }

        public static _defaultFailedCallback( err, methodName )
        {
            var error = err.get_exceptionType() + "-- " + err.get_message();
            throw Sys.Net.WebServiceProxy._createFailedError( methodName, String.format( Sys.Res.webServiceFailed, methodName, error ) );
        }

        public static _generateTypedConstructor( type )
        {
            return function( properties )
            {
                if ( properties )
                {
                    for ( var name in properties )
                    {
                        this[ name ] = properties[ name ];
                    }
                }
                this.__type = type;
            }
        }
    }
}

