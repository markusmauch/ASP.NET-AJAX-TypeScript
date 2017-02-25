
module Sys
{
    export type EventHandler = ( sender: any, args?: EventArgs ) => void;
    
    /**
     * Creates a dictionary of client events for a component, with event names as keys and the associated handlers as values.
     */
    export class EventHandlerList
    {
        private _list: { [id: string]: EventHandler[] } = {};

        /**
         * Attaches a handler to an event in an {@link Sys.EventHandlerList} instance and adds the event to the list if it is not already present.
         * @param id
         *      A string that specifies the event.
         * @param handler
         *      The name of the method to handle the event.
         */
        public addHandler( id: string, handler: EventHandler ): void
        {
            let list = this._getEvent( id, true );
            if ( list !== null )
            {
                Array.add( list, handler );
            }
        }
		
        /**
         * Returns a single method that can be invoked to call all handlers sequentially for the specified event.
         * @param id
         *      The ID for the specified event.
         * @returns
         *      A single method that can be invoked to call all handlers sequentially for the specified event.
         */
        public getHandler( id: string ): EventHandler | null
        {
            let evt = this._getEvent( id );
            if ( !evt || ( evt.length === 0 ) ) return null;
            
            let clone = Array.clone( evt ) || [];
            return ( source, args? ) =>
            {
                args = args || new Sys.EventArgs();
                for ( let i = 0, l = clone.length; i < l; i++ )
                {
                    clone[i]( source, args );
                }
            };
        }
		
        /**
         * Removes an event handler from an event in an {@libnk Sys.EventHandlerList} instance.
         * @param id
         *      The ID for the event.
         * @param handler
         *      The handler to remove from the event.
         */
        public removeHandler( id: string, handler: EventHandler ): void
        {
            let list = this._getEvent( id, true );
            if ( list !== null )
            {
                Array.remove( list, handler );
            }
        }

        private _getEvent( id: string, create = false ): EventHandler[] | null
        {
            if ( this._list[id] === undefined )
            {
                if ( create === false ) return null;
                this._list[id] = [];
            }
            return this._list[id];
        }
    }
}
