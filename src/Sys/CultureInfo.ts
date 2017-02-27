module Sys
{
    interface ICultureInfo
    {
        name: string,
        numberFormat:
        {
            CurrencyDecimalDigits: number,
            CurrencyDecimalSeparator: string,
            IsReadOnly: true,
            CurrencyGroupSizes: number[],
            NumberGroupSizes: number[],
            PercentGroupSizes: number[],
            CurrencyGroupSeparator: string,
            CurrencySymbol: string,
            NaNSymbol: string,
            CurrencyNegativePattern: number,
            NumberNegativePattern: number,
            PercentPositivePattern: number,
            PercentNegativePattern: number,
            NegativeInfinitySymbol: string,
            NegativeSign: string,
            NumberDecimalDigits: number,
            NumberDecimalSeparator: string,
            NumberGroupSeparator: string,
            CurrencyPositivePattern: number,
            PositiveInfinitySymbol: string,
            PositiveSign: string,
            PercentDecimalDigits: number,
            PercentDecimalSeparator: string,
            PercentGroupSeparator: string,
            PercentSymbol: string,
            PerMilleSymbol: string,
            NativeDigits: string[],
            DigitSubstitution: number
        },
        dateTimeFormat:
        {
            AMDesignator: "AM" | "PM",
            Calendar:
            {
                MinSupportedDateTime: string,
                MaxSupportedDateTime: string,
                AlgorithmType: 1,
                CalendarType: 1,
                Eras: number[],
                TwoDigitYearMax: number,
                IsReadOnly: boolean
            },
            DateSeparator: "/",
            FirstDayOfWeek: 0,
            CalendarWeekRule: 0,
            FullDateTimePattern: string,
            LongDatePattern: string,
            LongTimePattern: string,
            MonthDayPattern: string,
            PMDesignator: "AM" | "PM",
            RFC1123Pattern: string,
            ShortDatePattern: string,
            ShortTimePattern: string,
            SortableDateTimePattern: string,
            TimeSeparator: string,
            UniversalSortableDateTimePattern: string,
            YearMonthPattern: string,
            AbbreviatedDayNames: string[],
            ShortestDayNames: string[],
            DayNames: string[],
            AbbreviatedMonthNames: string[],
            MonthNames: string[],
            IsReadOnly: boolean,
            NativeCalendarName: string,
            AbbreviatedMonthGenitiveNames: string[],
            MonthGenitiveNames: string[]
        },
        eras: any[]
    }


    /**
     * Represents a culture definition that can be applied to objects that accept a culture-related setting.
     * @see {@link http://msdn.microsoft.com/en-us/library/bb384004(v=vs.100).aspx}
     */
    export class CultureInfo
    {
        /**
         * Initializes a new instance of the Sys.CultureInfo class.   
         * @param name
         *      The culture value (locale) that represents a language and region.
         * @param numberFormat
         *      A culture-sensitive numeric formatting string.
         * @param dateTimeFormat
         *      A culture-sensitive date formatting string.
         */
        constructor( name: string, numberFormat: string, dateTimeFormat: string )
        {
            this.name = name;
            //this.numberFormat = numberFormat;
            //this.dateTimeFormat = dateTimeFormat;
        }

        /**
         * Gets an object that contains an array of culture-sensitive formatting and parsing strings values that can be applied to Number type extensions. 
         * Use the numberFormat field to retrieve an object that contains an array of formatting strings that are based on the current culture or on the invariant culture. 
         * Each formatting string can be used to specify how to format Number type extensions.
         * @returns
         *      An object that contains an array of culture-sensitive formatting strings.  
         */
        public static numberFormat: string[];

        /**
         * Gets the culture value (locale) that represents a language and region.
         * @returns
         *      The culture value (locale) that represents a language and region.
         */
        public name: string;

        /**
         * Gets the globalization values of the invariant culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
         * The InvariantCulture field contains the following fields associated with the invariant (culture-independent) culture: name, dateTimeFormat, and numberFormat.
         * @returns
         *      A CultureInfo object.  
         */
        static InvariantCulture: CultureInfo;

        /**
         * Gets the globalization values of the current culture as sent by the server. This member is static and can be invoked without creating an instance of the class.
         * The CurrentCulture field contains the following fields associated with the current culture: name, dateTimeFormat, and numberFormat.
         * @returns
         *      A Sys.CultureInfo object.
         */

        static CurrentCulture: CultureInfo;
        /**
         * Gets an object that contains an array of culture-sensitive formatting and parsing string values that can be applied to Date type extensions.
         * Use the dateTimeFormat field to retrieve an object that contains an array of formatting strings that are based on the current culture or on the invariant culture. 
         * Each formatting string can be used to specify how to format Date type extensions.
         * @returns
         *      An object that contains an array of culture-sensitive formatting strings.
         */
        public static dateTimeFormat: string[];

        public static _parse( value: ICultureInfo )
        {
            let dtf = value.dateTimeFormat;
            /*
            if ( dtf && !dtf.eras )
            {
                dtf.eras = value.eras;
            }
            return new Sys.CultureInfo( value.name, value.numberFormat, dtf );
            */
        }
    }
}