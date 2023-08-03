const responseDeveloper = require('./responseDev');
const indentC = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
const indentS = "&nbsp;&nbsp;&nbsp;&nbsp;";
const br = "<br>";

function help(specify) {
    if (specify.length <= 1) {
        let commands = [
            "<button>about                      learn more about what you can do.</button>",
            "   ",
            "<button>clear  [-a]    [-h]        clear the screen:</button>",
            "   ",
            "       -a                      clear all.",
            "       -h                      clear command history.",
            "   ",
            "<button>tag    {[-n]}  {[-c]}      configure your tag.</button>",
            "   ",
            "       -t      {string}        tagname, no spaces.",
            "       -c      {color}         css colors, rgb(x,x,x), hex(xxxxxx).",
            "   ",
            "<button>run    {program}           run applets integrated with R.U.N.</button>",
            "   ",
            "<button>set    {program}           configure supported programs and settings.</button>",
            "   ",
            "<cmd class='highlight'>help   [command]   display help for a specific command.</cmd>",
            "   ",
            "These commands are defined internally.",
        ];

        return responseDeveloper(commands);
    } else if (specify.length === 2) {
        const command = specify[1];
        switch (command) {
            case "clear":
                var array = [
                    indentC + "NAME",
                    indentC + indentS + "clear - clear the terminal screen.",
                    br,
                    indentC + "COMMAND",
                    indentC + indentS + "clear",
                    br,
                    indentC + "DESCRIPTION",
                    indentC + indentS + "clears your screen if this is possible.",
                ];
                return responseDeveloper(array);

            case "tag":
                var array1 = [
                    indentC + "NAME",
                    indentC + indentS + "tag - allows customization of prompt tag.",
                    br,
                    indentC + "COMMAND",
                    indentC + indentS + "tag, immediate parameter: [-n, -c] are required.",
                    br,
                    indentC + "DESCRIPTION",
                ];

                var array2 = [
                    indentC + indentS + "-n:" + indentS + "{Name} cannot have any spaces.<br>",
                    indentC + indentS + "-c:" + indentS + "{Color} must be a valid hex color in the format hex(XXXXXX),",
                    indentC + indentS + "or an RGB color in the format 'rgb(x,x,x)'.",
                    indentC + indentS + "Alternatively, a predefined CSS color, i.e:<br>",
                    indentC + indentS + indentS + "- Red",
                    indentC + indentS + indentS + "- Orange",
                    indentC + indentS + indentS + "- Yellow",
                    indentC + indentS + indentS + "- Green",
                    indentC + indentS + indentS + "- Blue",
                    indentC + indentS + indentS + "- Purple",
                    indentC + indentS + indentS + "- Pink",
                    indentC + indentS + indentS + "- Brown",
                    indentC + indentS + indentS + "- Gray",
                    indentC + indentS + indentS + "- Black" + br,
                    indentC + indentS + "or simply type 'default' to return to the original color.",
                ];
                return responseDeveloper(array1.concat(array2));
            case "run":
                var array1 = [
                    indentC + "NAME",
                    indentC + indentS + "run - command used to start a program.",
                    br,
                    indentC + "COMMAND",
                    indentC + indentS + "run, immediate parameter: [program name] is required.",
                    br,
                    indentC + "DESCRIPTION",
                ];
                var array2 = [
                    indentC + indentS + indentS + "- typetest: Test your typing speed." + br,
                    indentC + indentS + indentS + "options:",
                    indentC + indentS + indentS + indentS + "-w:" + indentS + "{Words}, This mode lets you test your typing speed for a certain number of words.",
                    indentC + indentS + indentS + indentS + "-t:" + indentS + "{Time}, This mode lets you test your typing speed for a certain number of seconds.",
                ];
                return responseDeveloper(array1.concat(array2));

            // Add other cases here for other commands
            default:
                return `'${specify}' is not a valid help command`;
        }
    }
}

module.exports = help;