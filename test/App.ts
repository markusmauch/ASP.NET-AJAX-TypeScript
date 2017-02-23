
let ctrl = $get( "Control" );


class Test extends Sys.UI.Control
{
    private _title: string;
    private _backgroundColor: string;
    
    public initialize()
    {
        this.get_element().style.backgroundColor = this.get_backgroundColor();
        this._element.addEventListener( "click", () =>
        {
            let h = this.get_events().getHandler( "click" );
            if ( h !== null ) h( this );
        } );
    }

    public get_title()
    {
        return this._title;
    }
    
    public set_title( value: string )
    {
        this._title = value;
    }

    public get_backgroundColor()
    {
        return this._backgroundColor;
    }
    
    public set_backgroundColor( value: string )
    {
        this._backgroundColor = value;
    }

    public add_click( handler: Sys.EventHandler )
    {
        this.get_events().addHandler( "click", handler );
    }
}

interface TestProps extends Sys.UI.ControlProps
{
    title: string;
    backgroundColor: string;
}

interface TestEvents extends Sys.ComponentEvents
{
    click: Sys.EventHandler;
}

let props: TestProps = { id: "test", title: "title", backgroundColor: "grey" };
let events: TestEvents = { click: ( sender, args ) => { console.log( "click" ) } };

let test = Sys.Component.create( Test, props, events, null, ctrl );

