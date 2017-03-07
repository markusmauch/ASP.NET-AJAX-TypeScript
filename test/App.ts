
let ctrl = $get( "Control" );

Sys.Application.add_load( ( sender, args ) => console.log( "Sys.Application.load" ) );

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

        let sb = new Sys.StringBuilder( "Hallo" );
        sb.appendLine( "Hallo" );
        sb.append( "Welt" );
        console.log( sb.toString() );
        console.log( sb.isEmpty() );
        sb.clear();
        console.log( sb.isEmpty() );
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

    public add_click( handler: Sys.EventHandler<Test, Sys.EventArgs> )
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
    click: Sys.EventHandler<Test, Sys.EventArgs>;
}

let props: TestProps = { id: "test", title: "title", backgroundColor: "grey" };
let events: TestEvents = { click: ( sender, args ) => { console.log( "click" ) } };

let test = $create( Test, props, events, null, ctrl );


console.log( "UA: " + ( Sys.Browser.agent === Sys.Browser.Safari ) )

let request = new Sys.Net.WebRequest();
request.set_url( "http://localhost:3000/tsconfig.json" );
request.set_httpVerb( "GET" );
request.add_completed( ( sender, args ) =>
{
    console.log( "OK" );
    let t = sender.get_responseData();
    console.log( t );
    
} );
request.invoke();