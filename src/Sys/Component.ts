
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
        private _id: string;
        private _events = new Sys.EventHandlerList();
        
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
            this.get_events().removeHandler("disposing", handler);
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public add_propertyChanged( handler )
        {
            this.get_events().addHandler("propertyChanged", handler);
        }

        /**
         * Raised when the raisePropertyChanged method of the current Component object is called.
         * @param handler
         *      The event handler function to add or remove.
         */
        public remove_propertyChanged( handler )
        {
            this.get_events().removeHandler("propertyChanged", handler);
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
        {
        }

        public static create<T extends Sys.Component>( type: { new(): T; }, properties: { [name: string]: any } | null, events: { [name: string]: any } | null, references: any | null, element: HTMLElement | null )
        {
            if ( type.inheritsFrom( Sys.Component ) === false )
            {
                throw Error.argument( "type", String.format( Sys.Res.createNotComponent, type.getName() ) );
            }
            if ( ( type.inheritsFrom( Sys.UI.Behavior ) || type.inheritsFrom( Sys.UI.Control ) ) && element === null )
            {
                throw Error.argument( "element", Sys.Res.createNoDom );
            }
            else if ( element )
            {
                throw Error.argument( "element", Sys.Res.createComponentOnDom );
            }
            
            let component;
            if ( type.inheritsFrom( Sys.UI.Behavior ) )
            {
                component = new Sys.UI.Behavior( element || new HTMLElement() );
            }
            else if ( type.inheritsFrom( Sys.UI.Control ) )
            {
                component = new Sys.UI.Control( element || new HTMLElement() );
            }
            else
            {
                component = new Sys.Component();
            }
            
            
            var app = Sys.Application;
            //var creatingComponents = app.get_isCreatingComponents();
            component.beginUpdate();
            
            if ( properties !== null )
            {
                component._setProperties( properties );
            }
            
            if ( events !== null )
            {
                for ( let name in events )
                {
                    //if (!(component["add_" + name] instanceof Function)) throw new Error.invalidOperation(String.format(Sys.Res.undefinedEvent, name));
                    //if (!(events[name] instanceof Function)) throw new Error.invalidOperation(Sys.Res.eventHandlerNotFunction);
                    component["add_" + name](events[name]);
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
            return component;
        }

        public _setProperties( properties: ComponentProperties )
        {

        }
    }

    export interface ComponentProperties
    {
        id: string;
    }

    export interface ComponentEvents
    {
        disposing: Sys.EventHandler;
        propertyChanged: Sys.EventHandler;
    }
}
