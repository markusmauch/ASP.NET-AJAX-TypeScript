
interface StringConstructor
{
    format(format : string, args : string[]) : string;
    _toFormattedString(useLocale : boolean, args : IArguments) : string;
}

String.format = function (format : string, args : string[]) {
    return String._toFormattedString(false, arguments);
}

String._toFormattedString = (useLocale : boolean, args : IArguments) => {
    var result = "";
    var format = args[0];
    for (var i = 0;;)
    {
        var open = format.indexOf('{', i);
        var close = format.indexOf('}', i);
        if ((open < 0) && (close < 0))
        {
            result += format.slice(i);
            break;
        }
        if ( ( close > 0 ) && ( ( close < open ) || ( open < 0 ) ) )
        {
            if (format.charAt(close + 1) !== '}')
            {
                throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
            }
            result += format.slice( i, close + 1 );
            i = close + 2;
            continue;
        }
        result += format.slice( i, open );
        i = open + 1;
        if ( format.charAt( i ) === '{' )
        {
            result += '{';
            i++;
            continue;
        }
        if ( close < 0 ) 
        {
            throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
        }
        var brace = format.substring(i, close);
        var colonIndex = brace.indexOf(':');
        var argNumber = parseInt((colonIndex < 0)
            ? brace
            : brace.substring(0, colonIndex), 10) + 1;
        if ( isNaN( argNumber ) ) 
            throw Error.argument( 'format', Sys.Res.stringFormatInvalid );
        var argFormat = ( colonIndex < 0 )
            ? ''
            : brace.substring(colonIndex + 1);
        var arg = args[argNumber];
        if (typeof(arg) === "undefined" || arg === null) {
            arg = '';
        }
        if (arg.toFormattedString)
        {
            result += arg.toFormattedString(argFormat);
        }
        else if (useLocale && arg.localeFormat)
        {
            result += arg.localeFormat(argFormat);
        }
        else if (arg.format)
        {
            result += arg.format(argFormat);
        }
        else 
        {
            result += arg.toString();
        }
        i = close + 1;
    }
    return result;
}