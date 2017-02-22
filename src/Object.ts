
interface ObjectConstructor
{
    getType( instance: any ): Function;
    getTypeName( instance: any ): string;
}

Object.getType = ( instance: any ) =>
{
    let ctor = instance.constructor;
    if ( !ctor || ( typeof( ctor ) !== "function" ) || !ctor.__typeName || ( ctor.__typeName === 'Object' ) )
    {
        return Object;
    }
    return ctor;
}

Object.getTypeName = ( instance: any ) =>
{
    let constructorString = instance.constructor.toString();
    return constructorString.match( /\w+/g )[1]; 
}

