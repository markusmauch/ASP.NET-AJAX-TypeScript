module Sys
{
    /**
     * Provides the base class for the Control and Behavior classes, and for any other object whose lifetime should be managed by the ASP.NET AJAX client library.
     */
    export class Component
    {
        private _initialized = false;
        private _disposed = false;
        private _updating = false;
        protected _id: string;
        protected _events = new Sys.EventHandlerList();

        /**
         * When overridden in a derived class, initializes an instance of that class and registers it with the application as a disposable object.
         */
        constructor()
        {
            if ( Sys.Application ) Sys.Application.registerDisposableObject( this );
        }

        public get_events()
        {
            return this._events;
        }

        /**
         * Gets the ID of the current Component object.
         * @returns
         *      A string that contains the ID of the component.
         */
        public get_id()
        {
            return this._id;
        }

        /**
         * Sets the ID of the current Component object.
         * @param id
         *      A string that contains the ID of the component.
         */
        public set_id( id: string )
        {
            this._id = id;
        }

        /**
         * Gets a value indicating whether the current Component object is initialized.
         * @returns
         *      true if the current Component is initialized; otherwise, false.
         */
        public get_isInitialized()
        {
            return this._initialized;
        }

        /**
         * Gets a value indicating whether the current Component object is updating.
         * @returns
         *      true if the current Component object is updating; otherwise, false.
         */
        public get_isUpdating()
        {
            return this._updating;
        }

        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        public add_disposing( handler )
        {
            this.get_events().addHandler( "disposing", handler );
        }

        /**
         * Raised when the dispose method is called for a component.
         * @param handler
         *      The event handler function to add or remove.
         */
        public remove_disposing( handler )
        {
            this.get_events().removeHandler( "disposing", handler );
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public add_propertyChanged( handler )
        {
            this.get_events().addHandler( "propertyChanged", handler );
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public remove_propertyChanged( handler )
        {
            this.get_events().removeHandler( "propertyChanged", handler );
        }

        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has begun.
         */
        public beginUpdate()
        {
            this._updating = true;
        }

        public dispose()
        {
            if ( this._disposed === false )
            {
                // do dispose

                this._disposed = true;
            }
        }

        /**
         * Called by the create method to indicate that the process of setting properties of a component instance has finished.
         */
        public endUpdate()
        {
            this._updating = false;
            if ( !this._initialized ) this.initialize();
            this.updated();
        }

        public initialize()
        {
            this._initialized = true;
        }

        public updated()
        {}

        public static create < C extends Sys.Component | Sys.UI.Control | Sys.UI.Behavior, P extends ComponentProps > (
            type:
            {
                new( element ? : HTMLElement ): C;
            },
            properties: P | null,
            events:
            {
                [ name: string ]: any
            } | null,
            references: any | null,
            element: HTMLElement | null )
        {
            let component;
            if ( type.inheritsFrom( Sys.UI.Control ) || type.inheritsFrom( Sys.UI.Behavior ) )
            {
                if ( element === null )
                {
                    throw Error.argument( "element", Sys.Res.createComponentOnDom );
                }
                component = new type( element );
            }
            else
            {
                component = new Sys.Component();
            }

            //var app = Sys.Application;
            //var creatingComponents = app.get_isCreatingComponents();

            component.beginUpdate();

            if ( properties !== null )
            {
                Sys.Component._setProperties( component, properties );
            }

            if ( events !== null )
            {
                for ( let name in events )
                {
                    if ( !( component[ "add_" + name ] instanceof Function ) )
                    {
                        throw Error.invalidOperation( String.format( Sys.Res.undefinedEvent, name ) );
                    }
                    if ( !( events[ name ] instanceof Function ) )
                    {
                        throw Error.invalidOperation( Sys.Res.eventHandlerNotFunction );
                    }
                    component[ "add_" + name ]( events[ name ] );
                }
            }

            // if ( component.get_id() )
            // {
            //     app.addComponent(component);
            // }
            // if ( creatingComponents )
            // {
            //     app._createdComponents[app._createdComponents.length] = component;
            //     if (references) {
            //         app._addComponentToSecondPass(component, references);
            //     }
            //     else {
            //         component.endUpdate();
            //     }
            // }
            // else {
            //     if (references) {
            //         Sys$Component$_setReferences(component, references);
            //     }
            //     component.endUpdate();
            // }

            component.endUpdate();

            return component;
        }

        public static _setProperties( target: Sys.Component, properties: ComponentProps )
        {
            let current;
            let targetType = Object.getType( target );
            let isObject = ( targetType === Object ) || ( targetType === Sys.UI.DomElement );
            let isComponent = Sys.Component.isInstanceOfType( target ) && !target.get_isUpdating();
            if ( isComponent ) target.beginUpdate();

            for ( let name in properties )
            {
                let val = properties[ name ];
                let getter = isObject ? null : target[ "get_" + name ];
                if ( isObject || typeof( getter ) !== 'function' )
                {
                    let targetVal = target[ name ];
                    if ( !isObject && typeof( targetVal ) === 'undefined' ) throw Error.invalidOperation( String.format( Sys.Res.propertyUndefined, name ) );
                    if ( !val || ( typeof( val ) !== 'object' ) || ( isObject && !targetVal ) )
                    {
                        target[ name ] = val;
                    }
                    else
                    {
                        Sys.Component._setProperties( targetVal, val );
                    }
                }
                else
                {
                    let setter = target[ "set_" + name ];
                    if ( typeof( setter ) === 'function' )
                    {
                        setter.apply( target, [ val ] );
                    }
                    else if ( val instanceof Array )
                    {
                        current = getter.apply( target );
                        if ( !( current instanceof Array ) )
                        {
                            throw Error.invalidOperation( String.format( Sys.Res.propertyNotAnArray, name ) );
                        }
                        for ( let i = 0, j = current.length, l = val.length; i < l; i++, j++ )
                        {
                            current[ j ] = val[ i ];
                        }
                    }
                    else if ( ( typeof( val ) === 'object' ) && ( Object.getType( val ) === Object ) )
                    {
                        current = getter.apply( target );
                        if ( ( typeof( current ) === 'undefined' ) || ( current === null ) )
                        {
                            throw Error.invalidOperation( String.format( Sys.Res.propertyNullOrUndefined, name ) );
                        }
                        Sys.Component._setProperties( current, val );
                    }
                    else
                    {
                        throw Error.invalidOperation( String.format( Sys.Res.propertyNotWritable, name ) );
                    }
                }
            }
            if ( isComponent ) target.endUpdate();
        }
    }

    export interface ComponentProps
    {
        id: string;
    }

    export interface ComponentEvents
    {
        disposing ? : Sys.EventHandler < Sys.Component, Sys.EventArgs > ;
        propertyChanged ? : Sys.EventHandler < Sys.Component, Sys.EventArgs > ;
    }
}