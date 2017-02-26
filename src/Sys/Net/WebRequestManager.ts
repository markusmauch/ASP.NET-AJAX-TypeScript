module Sys.Net
{
	class _WebRequestManager
	{
		private _defaultTimeout = 0;
		private _defaultExecutorType = Sys.Net.XMLHttpExecutor;

		private _events = new Sys.EventHandlerList();

		public add_invokingRequest( handler: EventHandler<_WebRequestManager, Sys.Net.NetworkRequestEventArgs> )
		{
			this._get_eventHandlerList().addHandler( "invokingRequest", handler );
		}

		public remove_invokingRequest( handler: EventHandler<_WebRequestManager, Sys.Net.NetworkRequestEventArgs> )
		{
			this._get_eventHandlerList().removeHandler( "invokingRequest", handler );
		}

		public add_completedRequest( handler: EventHandler<_WebRequestManager, Sys.Net.NetworkRequestEventArgs> )
		{
			this._get_eventHandlerList().addHandler( "completedRequest", handler );
		}

		public remove_completedRequest( handler: EventHandler<_WebRequestManager, Sys.Net.NetworkRequestEventArgs> )
		{
			this._get_eventHandlerList().removeHandler( "completedRequest", handler );
		}

		public _get_eventHandlerList()
		{
			return this._events;
		}

		public get_defaultTimeout()
		{
			return this._defaultTimeout;
		}

		public set_defaultTimeout( value: number )
		{
			if ( value < 0 )
			{
				throw Error.argumentOutOfRange( "value", value, Sys.Res.invalidTimeout );
			}
			this._defaultTimeout = value;
		}

		public get_defaultExecutorType()
		{
			return this._defaultExecutorType;
		}

		public set_defaultExecutorType( value )
		{
			this._defaultExecutorType = value;
		}

		public executeRequest( webRequest: Sys.Net.WebRequest )
		{
			let executor = webRequest.get_executor();
			if ( !executor )
			{
				let failed = false;
				try
				{
					executor = new this._defaultExecutorType();
				}
				catch ( e )
				{
					failed = true;
				}
				if ( failed || !Sys.Net.WebRequestExecutor.isInstanceOfType( executor ) || !executor )
				{
					throw Error.argument( "defaultExecutorType", String.format( Sys.Res.invalidExecutorType, this._defaultExecutorType.toString() ) );
				}
				webRequest.set_executor( executor );
			}
			if ( executor.get_aborted() )
			{
				return;
			}
			let evArgs = new Sys.Net.NetworkRequestEventArgs( webRequest );
			let handler = this._get_eventHandlerList().getHandler( "invokingRequest" );
			if ( handler )
			{
				handler( this, evArgs );
			}
			if ( !evArgs.get_cancel() )
			{
				executor.executeRequest();
			}
		}
	}

	export var WebRequestManager = new _WebRequestManager();
}
