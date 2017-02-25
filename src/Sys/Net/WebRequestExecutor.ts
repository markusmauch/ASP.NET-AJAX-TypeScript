module Sys.Net
{
	export abstract class WebRequestExecutor
	{
		private _webRequest: WebRequest;
		private _resultObject = null;

		public get_webRequest()
		{
			return this._webRequest;
		}

		public _set_webRequest( value: WebRequest )
		{
			this._webRequest = value;
		}

		public abstract get_started(): boolean;

		public abstract get_responseAvailable(): boolean;

		public abstract get_timedOut(): boolean;

		public abstract get_aborted(): boolean;

		public abstract get_responseData(): string;

		public abstract get_statusCode(): string;

		public abstract get_statusText(): string;

		public abstract get_xml(): string;

		public get_object()
		{
			if ( !this._resultObject )
			{
				this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize( this.get_responseData() );
			}
			return this._resultObject;
		}
	}
}
