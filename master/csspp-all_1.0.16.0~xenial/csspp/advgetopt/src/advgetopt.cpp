/*    advgetopt -- advanced get option implementation
 *    Copyright (C) 2006-2017  Made to Order Software Corporation
 *
 *    This program is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License along
 *    with this program; if not, write to the Free Software Foundation, Inc.,
 *    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 *    Authors
 *    Alexis Wilke   alexis@m2osw.com
 */

/** \file
 * \brief Advanced getopt implementation.
 *
 * The advgetopt class and implementation is an advanced library to parse
 * command line parameters from static definitions specified by the caller.
 *
 * The class supports the command line options, options found in a default
 * configuration file or in a user defined configuration file.
 *
 * The class also includes support for displaying error messages and help
 * information about all the command line arguments.
 */
#include    "advgetopt.h"

// C++ lib
//
#include    <algorithm>
#include    <fstream>
#include    <fstream>
#include    <iostream>
#include    <iomanip>
#include    <sstream>

// C lib
//
#include    <stdarg.h>
#include    <stdlib.h>
#include    <errno.h>
#include    <string.h>

/** \brief The advgetopt environment to parse command line options.
 *
 * This namespace encompasses all the declarations and implementations
 * of functions used to parse and access the command line options.
 */
namespace advgetopt
{


namespace
{

/** \brief Value when no default option was defined.
 *
 * Some options may have defaults in which case their indexes are used.
 * By default, an option has no defaults and we instead use -1.
 */
const int NO_DEFAULT_OPT = -1;


/** \brief Check whether this parameter is an argument.
 *
 * An argument is defined as a command line parameter that starts with
 * a dash and is not just "-".
 *
 * Note that "--" is viewed as an argument (this function returns true)
 * and the getopt class takes it as a command meaning any other parameter
 * is not an argument.
 */
bool is_arg(char const * a)
{
    // "-" and "--" are not options; however "--" returns true
    // because after a "--" we take the data as default arguments
    return a[0] == '-' && a[1] != '\0';
}

} // no name namespace



/** \class getopt_exception
 * \brief Base exception of the advgetopt class.
 *
 * This exception is the base exception of all the advgetopt exceptions.
 * Catching this exception allows you to capture all the getopt exceptions.
 */


/** \class getopt_exception_default
 * \brief No default and no value specified.
 *
 * When a parameter is not specified and no default is available, this
 * exception is raised.
 */


/** \class getopt_exception_undefined
 * \brief Attempting to access something that is undefined.
 *
 * This exception is used when you attempt to access data that was not
 * defined. For example, if your tool tries to read parameter "version"
 * and that was not defined in the list of options, this exception is
 * raised.
 */


/** \class getopt_exception_invalid
 * \brief Attempted to use some invalid data.
 *
 * This exception is used whenever an attempt is made to access data that
 * does not make sense (is invalid.)
 *
 * For example, the table of options makes use of enumerations for different
 * parts. If one of these has a value which does not represent a valid
 * enumeration value, then this exception is raised.
 */


/** \class getopt
 * \brief Class used to parse command line options.
 *
 * This class is the one used by all the wpkg tools to parse the command line
 * options. It is very advanced and is capable to read many different types
 * of options with a letter (-h) and a word (--verbose) with no parameters,
 * one parameter, any number of parameters, and a set of "filenames" (lose
 * options that are not specific to an option.)
 */


/** \struct getopt::option
 * \brief Structure representing an option.
 *
 * When creating a getopt() object you have to pass an array of options. That
 * array is defined as a set of option structures where the last one has
 * its f_arg_mode set to end_of_options. The other parameters may still be
 * defined as the last option is used to define what the parser should do
 * with the lose options (in most cases it is named "filenames" and used
 * as an array of files, paths, windows package names, etc.)
 */


/** \struct getopt::optmap_info
 * \brief Structure used internally to save each options.
 *
 * Options are saved as in a map using an optmap_info structure entry.
 */


/** \brief Initialize the getopt object.
 *
 * The constructor initializes a getopt object and parse the specified
 * argv array. If defined, it also parses a configuration file and
 * an environment variable.
 *
 * The order in which parameters are parsed is important since only the
 * last value is kept:
 *
 * \li Each existing configuration file in the order defined in the vector;
 * \li The environment variable;
 * \li the argv array.
 *
 * The constructor calls the reset() function to start the parsing. It is
 * possible to call the reset() function at any time to parse a new set
 * of parameters.
 *
 * The argv array cannot be nullptr and the array cannot be empty. It must have
 * at least one entry representing the program name (argv[0]).
 *
 * The configuration_files vector can be empty in which case no configuration
 * files are read.
 *
 * The environment_variable_name can be nullptr or the empty string in which case
 * it is ignored.
 *
 * \note
 * All the data gets copied while parsed. If the argv array is deleted on
 * return, the getopt object remains valid.
 *
 * \param[in] argc  The number of arguments in argv.
 * \param[in] argv  An array of strings representing arguments.
 * \param[in] opts  The list of options that your program supports.
 * \param[in] configuration_files  A list of configuration file names.
 * \param[in] environment_variable_name  The name of an environment variable to parse as parameters.
 */
getopt::getopt(int argc
             , char * argv[]
             , option const * opts
             , std::vector<std::string> const configuration_files
             , char const * environment_variable_name)
{
    reset(argc, argv, opts, configuration_files, environment_variable_name);
}


/** \brief Reset the array of options and parse the argv array.
 *
 * This function resets the current list of options and then parses, in
 * this order, the:
 *
 * \li Configuration Files
 *
 * Each configuration file is checked one after another. Each file that is
 * defined is loaded and each line is viewed as an option. If valid, it is
 * added to the resulting getopt list of options.
 *
 * Note that it is an error to define a command in a configuration file. If
 * that happens, an error occurs and the process stops. Technically this is
 * defined with the GETOPT_FLAG_CONFIGURATION_FILE flag in your opt table.
 *
 * The list of files is checked from beginning to end. So if a later file
 * changes an option of an earlier file, it is the one effective.
 *
 * Configuration file support a project name as defined in the
 * get_project_name() function. It allows for a sub-directory to
 * be inserted between the path and the basename of the configuration
 * file. This allows for a file to be search in an extra sub-directory
 * so one can avoid changing the original definitions and only use
 * configuration files in the sub-directory. The path looks like this
 * when a project name is specified:
 *
 * \code
 *      <path>/<project name>.d/<basename>
 * \endcode
 *
 * Notice that we add a ".d" as usual in other projects under Linux.
 *
 * \li Environment Variable
 *
 * If the name of an environment variable is specified, then it is read
 * as a command line string. This function parses the string in an array
 * of strings (as argv is defined) and then parses it as an argv array.
 *
 * Since the environment variable is checked after the configuration files,
 * the options defined in the variable can change the definitions from
 * the configuration files.
 *
 * Like in the configuration files, only options can be specified in the
 * environment variable. Commands, however, generate an error. This is
 * marked by the GETOPT_FLAG_ENVIRONMENT_VARIABLE flag in your opt variable.
 * In other words, you may allow options to appear on the command line, in
 * configuration files, in environment variables or a mix of all these
 * locations.
 *
 * \li argv array
 *
 * Finally, the argv array is checked. That's the actual parameters on the
 * command line. The arguments here will overwrite the selections of the
 * configuration files and environment variable.
 *
 * Note that this array is the only one that should include a command (opposed
 * to an option that alters the behavior of your commands.) However, the
 * advgetopt system expects you to properly define what can be used in a
 * configuration file, in an environment variable, or directly on the command
 * line.
 *
 * \note
 * Errors that come from an invalid list of options (i.e. duplicates of
 * options, for example) raise an exception since these are to be fixed
 * once by the programmer. Errors found on the command line generate a
 * call to the usage() function which ends with an exit(1) call after
 * printing out an error message and the Usage: ... output optimized in
 * case of errors.
 *
 * \todo
 * Add support for quotes in configuration files as parameters are otherwise
 * saved as a separated list of parameters losing the number of spaces between
 * each entry.
 *
 * \exception getopt_exception_invalid
 * This function generates the getopt_exception_invalid exception whenever
 * something invalid is found in the list of options passed as the \p opts
 * parameter.
 *
 * \exception getopt_exception_default
 * The function detects whether two options are marked as the default
 * option (the one receiving parameters that are not used by another command
 * or match a command.) This exception is raised when such is detected.
 *
 * \param[in] argc  The number of arguments in argv.
 * \param[in] argv  An array of strings representing arguments.
 * \param[in] opts  The list of options that your program supports.
 * \param[in] configuration_files  A list of configuration file names.
 * \param[in] environment_variable_name  The name of an environment variable to parse as parameters.
 */
void getopt::reset(int argc
                 , char * argv[]
                 , option const * opts
                 , std::vector<std::string> const configuration_files
                 , char const * environment_variable_name)
{
    f_options = opts;
    f_map.clear();
    f_program_fullname = argv[0];
    size_t p(f_program_fullname.find_last_of('/'));
    if(p == std::string::npos)
    {
        // MS-Windows path uses \ instead of /
        p = f_program_fullname.find_last_of('\\');
    }
    if(p != std::string::npos)
    {
        // remove the path
        f_program_name = f_program_fullname.c_str() + p + 1;
    }
    else
    {
        f_program_name = f_program_fullname;
    }

    // search for the default argument, although there may not be one
    int def_opt(NO_DEFAULT_OPT);
    size_t count(0);
    std::map<char, int> opt_by_short_name;
    std::map<std::string, int> opt_by_long_name;
    for(int opts_max(0); opts[opts_max].f_arg_mode != argument_mode_t::end_of_options; ++opts_max)
    {
        if(opts[opts_max].f_opt != '\0')
        {
            if(opt_by_short_name.find(opts[opts_max].f_opt) != opt_by_short_name.end())
            {
                throw getopt_exception_invalid(std::string("short name option \"") + opts[opts_max].f_opt + "\" defined twice");
            }
            opt_by_short_name[opts[opts_max].f_opt] = opts_max;
            ++count;
        }
        else if(opts[opts_max].f_name == nullptr)
        {
            switch(opts[opts_max].f_arg_mode)
            {
            case argument_mode_t::required_argument:
            case argument_mode_t::optional_argument:
            case argument_mode_t::required_multiple_argument:
            case argument_mode_t::optional_multiple_argument:
            case argument_mode_t::required_long:
            case argument_mode_t::optional_long:
            case argument_mode_t::required_multiple_long:
            case argument_mode_t::optional_multiple_long:
                throw getopt_exception_invalid("an unnamed option is only valid with a no argument, default argument, help argument, and end of options");

            case argument_mode_t::no_argument:
            case argument_mode_t::default_argument:
            case argument_mode_t::default_multiple_argument:
                opt_by_long_name["--"] = opts_max;
                ++count;
                break;

            case argument_mode_t::help_argument:
            case argument_mode_t::end_of_options:
                break;

            }
        }
        if(opts[opts_max].f_name != nullptr)
        {
            if(strlen(opts[opts_max].f_name) < 2)
            {
                throw getopt_exception_invalid("a long name option must be at least 2 characters");
            }
            if(opt_by_long_name.find(opts[opts_max].f_name) != opt_by_long_name.end())
            {
                throw getopt_exception_invalid(std::string("long name option \"") + opts[opts_max].f_name + "\" defined twice");
            }
            opt_by_long_name[opts[opts_max].f_name] = opts_max;
            ++count;
        }
        else if((opts[opts_max].f_flags & GETOPT_FLAG_CONFIGURATION_FILE) != 0)
        {
            throw getopt_exception_invalid(std::string("all configuration options require a long name, that includes \"") + opts[opts_max].f_opt + "\"");
        }
        switch(opts[opts_max].f_arg_mode)
        {
        case argument_mode_t::default_argument:
        case argument_mode_t::default_multiple_argument: // this is contradictory with the if() below!
            if(def_opt != NO_DEFAULT_OPT)
            {
                // we cannot have more than one default option
                throw getopt_exception_default("more than one default argument defined in opts");
            }
            def_opt = opts_max;
            break;

        default:
            // we're only interested in the default argument at this point
            break;

        }
    }
    if(count == 0)
    {
        throw getopt_exception_invalid("an empty list of options is not legal, you must defined at least one (i.e. --version, --help...)");
    }

    // load options from configuration files as specified by caller
    for( size_t use_sub_path(0); use_sub_path < (f_project_name.empty() ? 1UL : 2UL); ++use_sub_path)
    {
        for( auto const & filename : configuration_files )
        {
            // empty strings in this array are just ignored
            if(filename.empty())
            {
                continue;
            }
            if(filename[0] == '@'
            && filename.back() == '@'
            && filename.length() > 2)
            {
                // record the project name
                //
                if(!f_project_name.empty())
                {
                    if(use_sub_path == 0)
                    {
                        throw getopt_exception_invalid("the list of configuration filenames cannot include more than one project name.");
                    }
                    // no need to extract this name again
                    continue;
                }
                f_project_name = filename.substr(1, filename.length() - 2);
                continue;
            }

            std::string adjusted_filename(filename);
            if(use_sub_path)
            {
                size_t const pos(filename.find_last_of('/'));
                if(pos != std::string::npos && pos > 0)
                {
                    adjusted_filename = filename.substr(0, pos) + "/" + f_project_name + ".d" + filename.substr(pos);
                }
                else
                {
                    adjusted_filename = f_project_name + ".d/" + filename;
                }
            }

            std::ifstream conf(adjusted_filename);
            if( !conf )
            {
                if(errno == ENOENT)
                {
                    continue;
                }
                // we let it go through and we will get an error from
                // the read_file() instead
            }

            std::string str;
            int line(0);
            while( !conf.eof() )
            {
                std::getline( conf, str );
                ++line;
                char const * s(str.c_str());
                while(isspace(*s))
                {
                    ++s;
                }
                if(*s == '\0' || *s == '#')
                {
                    // skip empty lines and comments
                    continue;
                }
                char const * str_name(s);
                char const * e(nullptr);
                while(*s != '=' && *s != '\0')
                {
                    if(isspace(*s))
                    {
                        e = s;
                        while(isspace(*s))
                        {
                            ++s;
                        }
                        if(*s != '\0' && *s != '=')
                        {
                            usage(status_t::error, "option name from \"%s\" on line %d in configuration file \"%s\" cannot include a space, missing = sign?",
                                            str.c_str(), line, filename.c_str());
                            /*NOTREACHED*/
                        }
                    }
                    else
                    {
                        ++s;
                    }
                }
                if(e == nullptr)
                {
                    e = s;
                }
                if(e - str_name == 0)
                {
                    usage(status_t::error, "no option name in \"%s\" on line %d from configuration file \"%s\", missing name before = sign?",
                                    str.c_str(), line, filename.c_str());
                    /*NOTREACHED*/
                }
                if(*str_name == '-')
                {
                    usage(status_t::error, "option names in configuration files cannot start with a dash in \"%s\" on line %d from configuration file \"%s\"",
                                    str.c_str(), line, filename.c_str());
                    /*NOTREACHED*/
                }
                std::string name(str_name, e - str_name);
                std::replace(name.begin(), name.end(), '_', '-');
                if(opt_by_long_name.find(name) == opt_by_long_name.end())
                {
                    // as a fallback allow _ in command line options
                    // (although either way you cannot have a mix of - and _ ...)
                    std::replace(name.begin(), name.end(), '-', '_');
                    if(opt_by_long_name.find(name) == opt_by_long_name.end())
                    {
                        usage(status_t::error, "unknown option \"%s\" found in configuration file \"%s\" on line %d",
                                        name.c_str(), filename.c_str(), line);
                        /*NOTREACHED*/
                    }
                }
                if((opts[opt_by_long_name[name.c_str()]].f_flags & GETOPT_FLAG_CONFIGURATION_FILE) == 0)
                {
                    // in configuration files we are expected to use '_' so
                    // print an error with such
                    //
                    std::replace(name.begin(), name.end(), '-', '_');
                    usage(status_t::error, "option \"%s\" is not supported in configuration files (found in \"%s\")", name.c_str(), filename.c_str());
                    /*NOTREACHED*/
                }
                if(*s == '=')
                {
                    do
                    {
                        ++s;
                    }
                    while(isspace(*s));
                }
                const char *str_value(s);
                std::vector<std::string> values;
                switch(opts[opt_by_long_name[name.c_str()]].f_arg_mode)
                {
                case argument_mode_t::required_multiple_argument:
                case argument_mode_t::optional_multiple_argument:
                case argument_mode_t::required_multiple_long:
                case argument_mode_t::optional_multiple_long:
                case argument_mode_t::default_multiple_argument:
                    // TODO: add support for quotes
                    //
                    while(*s != '\0')
                    {
                        if(isspace(*s))
                        {
                            if(s > str_value)
                            {
                                std::string v(str_value, s - str_value);
                                values.push_back(v);
                            }
                            str_value = s + 1;
                        }
                        ++s;
                    }
                    if(s > str_value)
                    {
                        std::string v(str_value, s - str_value);
                        values.push_back(v);
                    }
                    break;

                default:
                    // we expect exactly one argument, so just take the
                    // rest of the line and use that as the argument
                    //
                    while(isspace(*s))
                    {
                        ++s;
                    }
                    for(e = s + strlen(s); e > s; --e)
                    {
                        if(!isspace(e[-1]))
                        {
                            break;
                        }
                    }
                    // TODO: remove quotes if present
                    //
                    {
                        size_t const len(e - s);
                        if(len != 0)
                        {
                            values.push_back(std::string(s, len));
                        }
                    }
                    break;

                }
                if(values.size() > 0)
                {
                    // got parameters
                    int sub_argc(static_cast<int>(values.size() + 2)), sub_i(1);
                    std::vector<char *> sub_argv;
                    sub_argv.resize(values.size() + 3);
                    sub_argv[0] = argv[0];
                    sub_argv[1] = const_cast<char *>(name.c_str());
                    for(size_t idx(0); idx < values.size(); ++idx)
                    {
                        sub_argv[idx + 2] = const_cast<char *>(values[idx].c_str());
                    }
                    sub_argv[values.size() + 2] = nullptr;
                    add_options(opts + opt_by_long_name[name.c_str()], sub_i, sub_argc, &sub_argv[0]);
                }
                else
                {
                    // no parameters
                    int sub_argc(2), sub_i(1);
                    char *sub_argv[3];
                    sub_argv[0] = argv[0];
                    sub_argv[1] = const_cast<char *>(name.c_str());
                    sub_argv[2] = nullptr;
                    add_options(opts + opt_by_long_name[name.c_str()], sub_i, sub_argc, sub_argv);
                }
            }
        }
    }

    // check the environment variable if defined
    if(environment_variable_name != nullptr && *environment_variable_name != '\0')
    {
        char const * s(getenv(environment_variable_name));
        if(s != nullptr)
        {
            // this is exactly like the command line only in an environment variable
            // so parse the parameters just like the shell
            std::vector<std::string> args;
            std::string a;
            while(*s != '\0')
            {
                if(isspace(*s))
                {
                    if(!a.empty())
                    {
                        args.push_back(a);
                        a.clear();
                    }
                    do
                    {
                        ++s;
                    }
                    while(isspace(*s));
                }
                else if(*s == '"' || *s == '\'')
                {
                    // support quotations and remove them from the argument
                    char const quote(*s++);
                    while(*s != '\0' && *s != quote)
                    {
                        a += *s++;
                    }
                    if(*s != '\0')
                    {
                        ++s;
                    }
                }
                else
                {
                    a += *s++;
                }
            }
            if(!a.empty())
            {
                args.push_back(a);
            }
            // TODO: expand the arguments that include unquoted '*', '?', '[...]'

            std::vector<char *> sub_argv;
            sub_argv.resize(args.size() + 2);
            sub_argv[0] = argv[0];
            for(size_t idx(0); idx < args.size(); ++idx)
            {
                sub_argv[idx + 1] = const_cast<char *>(args[idx].c_str());
            }
            sub_argv[args.size() + 1] = nullptr;
            // IMPORTANT NOTE: the def_opt is passed down so a tool may allow
            //                 the default option to be used in the environment
            //                 variable; it is a good idea NOT to set the
            //                 flag in such commands
            parse_arguments(static_cast<int>(args.size() + 1), &sub_argv[0], opts, def_opt, opt_by_short_name, opt_by_long_name, true);
        }
    }

    parse_arguments(argc, argv, opts, def_opt, opt_by_short_name, opt_by_long_name, false);
}


/** \brief Parse an array of arguments.
 *
 * This function accepts an array of arguments as received by the main()
 * function. It also takes a list of options and maps thereof.
 *
 * The \p only_environment_variable parameter is set to true whenever the
 * function is called while parsing an environment variable. This allows
 * the function to know whether the given parameter is legal in an
 * environment variable or not. If not, then an error is issued and the
 * program exists.
 *
 * The function is considered internal, it gets called by the reset()
 * function.
 *
 * This function is not expected to throw errors, however, it may exit(1)
 * if an option is invalid after it calls the usage() function.
 *
 * \note
 * The function does NOT check whether the list of arguments (argv) is
 * terminated by nullptr. The argc parameter must be correct.
 *
 * \param[in] argc  The number of arguments in argv.
 * \param[in] argv  The argument strings terminated by a nullptr.
 * \param[in] opts  An array of valid command line options for your program.
 * \param[in] def_opt  The index of default option in opts.
 * \param[in] opt_by_short_name  A map of all the command options by short name (one letter).
 * \param[in] opt_by_long_name  A map of all the command options by long name (--\<name\>).
 */
void getopt::parse_arguments(int argc, char * argv[], option const * opts, int def_opt,
                             short_opt_name_map_t opt_by_short_name, long_opt_name_map_t opt_by_long_name,
                             bool only_environment_variable)
{
    for(int i(1); i < argc; ++i)
    {
        if(argv[i][0] == '-')
        {
            if(argv[i][1] == '-')
            {
                if(argv[i][2] == '\0')
                {
                    // end of options, skip the '--' and then anything else
                    // is taken as "filenames" (or whatever the tool expects)
                    if(def_opt == NO_DEFAULT_OPT)
                    {
                        usage(status_t::error, "default options not defined; thus -- is not accepted by this program");
                        /*NOTREACHED*/
                    }
                    if(only_environment_variable && (opts[def_opt].f_flags & GETOPT_FLAG_ENVIRONMENT_VARIABLE) == 0)
                    {
                        usage(status_t::error, "option -- is not supported in the environment variable");
                        /*NOTREACHED*/
                    }
                    // in this case we do NOT test whether an argument uses
                    // a dash (-) we take them all as default options
                    while(i + 1 < argc)
                    {
                        ++i;
                        add_option(opts + def_opt, argv[i]);
                    }
                }
                else
                {
                    // a long option, check that it is defined in the
                    // programmer defined options
                    if(opt_by_long_name.find(argv[i] + 2) == opt_by_long_name.end())
                    {
                        usage(status_t::error, "option %s is not supported", argv[i]);
                        /*NOTREACHED*/
                    }
                    if(only_environment_variable && (opts[opt_by_long_name[argv[i] + 2]].f_flags & GETOPT_FLAG_ENVIRONMENT_VARIABLE) == 0)
                    {
                        usage(status_t::error, "option %s is not supported in the environment variable", argv[i]);
                        /*NOTREACHED*/
                    }
                    add_options(opts + opt_by_long_name[argv[i] + 2], i, argc, argv);
                }
            }
            else
            {
                if(argv[i][1] == '\0')
                {
                    // stdin (a '-' by itself)
                    if(def_opt == NO_DEFAULT_OPT)
                    {
                        usage(status_t::error, "no default options defined; thus - is not accepted by this tool");
                        /*NOTREACHED*/
                    }
                    if(only_environment_variable && (opts[def_opt].f_flags & GETOPT_FLAG_ENVIRONMENT_VARIABLE) == 0)
                    {
                        usage(status_t::error, "option - is not supported in the environment variable");
                        /*NOTREACHED*/
                    }
                    // this is similar to a default option by itself
                    add_option(opts + def_opt, argv[i]);
                }
                else
                {
                    // short option(s)
                    int k(i);
                    int max(static_cast<int>(strlen(argv[k])));
                    for(int j = 1; j < max; ++j)
                    {
                        if(opt_by_short_name.find(argv[k][j]) == opt_by_short_name.end())
                        {
                            usage(status_t::error, "option -%c is not supported", argv[k][j]);
                            /*NOTREACHED*/
                        }
                        if(only_environment_variable && (opts[opt_by_short_name[argv[k][j]]].f_flags & GETOPT_FLAG_ENVIRONMENT_VARIABLE) == 0)
                        {
                            usage(status_t::error, "option -%c is not supported in the environment variable", argv[k][j]);
                            /*NOTREACHED*/
                        }
                        add_options(opts + opt_by_short_name[argv[k][j]], i, argc, argv);
                    }
                }
            }
        }
        else
        {
            // direct entry (filename or whatever the tool expects as a default)
            if(def_opt == NO_DEFAULT_OPT)
            {
                usage(status_t::error,
                    "no default option defined; we do not know what to do of \"%s\"; thus standalone parameters are not accepted by this tool",
                    argv[i]);
                /*NOTREACHED*/
            }
            if(only_environment_variable && (opts[def_opt].f_flags & GETOPT_FLAG_ENVIRONMENT_VARIABLE) == 0)
            {
                usage(status_t::error, "default options are not supported in the environment variable");
                /*NOTREACHED*/
            }
            add_option(opts + def_opt, argv[i]);
        }
    }
}


/** \brief Check whether a parameter is defined.
 *
 * This function returns true if the specified parameter is found as part of
 * the command line options.
 *
 * You must specify the long name of the option if one is defined. Otherwise
 * the name is the short name. So a --verbose option can be checked with:
 *
 * \code
 *   if(is_defined("verbose")) ...
 * \endcode
 *
 * However, if the option was defined as:
 *
 * \code
 * advgetopt::option options[] =
 * {
 *    [...]
 *    {
 *       'v',
 *       0,
 *       nullptr,
 *       nullptr,
 *       "increase verbosity",
         advgetopt::getopt::no_argument
 *    },
 *    [...]
 * };
 * \endcode
 *
 * then the previous call would fail because "verbose" does not exist in your
 * table. However, the option is accessible by its short name as a fallback
 * when it does not have a long name:
 *
 * \code
 *   if(is_defined("v")) ...
 * \endcode
 *
 * \param[in] name  The long (or short if long is undefined) name of the
 *                  option to check.
 *
 * \return true if the option was defined in a configuration file, the
 *         environment variable, or the command line.
 */
bool getopt::is_defined(std::string const & name) const
{
    return f_map.find(name) != f_map.end();
}


/** \brief Retrieve the number of arguments.
 *
 * This function returns the number of arguments that were specified after
 * the named option.
 *
 * The function returns zero if the argument was never specified on the
 * command line. If the option accepts exactly one parameter (i.e. not
 * marked as a multiple arguments option) then the function returns either
 * zero (not specified) or one (specified at least once.)
 *
 * \param[in] name  The name of the option to check.
 *
 * \return The number of arguments specified on the command line or zero.
 */
int getopt::size(std::string const & name) const
{
    optmap_t::const_iterator it(f_map.find(name));
    if(it != f_map.end())
    {
        return static_cast<int>(it->second.f_val.size());
    }
    return 0;
}


/** \brief Get the default value for this option.
 *
 * When an option is not defined, you may use this function to retrieve its
 * default instead. This is actually done automatically when you call the
 * get_string() or get_long() functions.
 *
 * An option without a default has this function returning nullptr.
 *
 * \exception getopt_exception_undefined
 * The getopt_exception_undefined exception is raised if this function is
 * called with an empty \p name.
 *
 * \param[in] name  The name of the parameter if which you want to retrieve
 *                  the default value.
 *
 * \return The default value or nullptr if no value is defined.
 */
char const * getopt::get_default(std::string const & name) const
{
    if(name.empty())
    {
        throw getopt_exception_undefined("command line name cannot be empty");
    }

    int const long_option(name.length() != 1);
    for(int i(0); f_options[i].f_arg_mode != argument_mode_t::end_of_options; ++i)
    {
        if(long_option)
        {
            if(f_options[i].f_name == nullptr)
            {
                if(f_options[i].f_opt == '\0')
                {
                    switch(f_options[i].f_arg_mode)
                    {
                    case argument_mode_t::no_argument:
                    case argument_mode_t::default_argument:
                    case argument_mode_t::default_multiple_argument:
                        if(name == "--")
                        {
                            return f_options[i].f_default;
                        }
                        break;

                    default:
                        // if invalid it was caught in reset()
                        break;

                    }
                }
            }
            else if(name == f_options[i].f_name)
            {
                return f_options[i].f_default;
            }
        }
        else
        {
            if(name[0] == f_options[i].f_opt)
            {
                return f_options[i].f_default;
            }
        }
    }

    return nullptr;    // no default
}


/** \brief This function retrieves an argument as a long value.
 *
 * This function reads the specified argument from the named option and
 * transforms it to a long value. It then checks the result against the
 * specified minimum and maximum range.
 *
 * The function name represents an argument that needs to be defined. You
 * can test whether it was defined on the command line with the is_defined()
 * function. The index must be between 0 and 'size() - 1' inclusive. If
 * the item was not defined, then size() returns zero and you cannot call
 * this function.
 *
 * The function does not check the validity of the minimum and maximum
 * parameters. If \p min \> \p max is true then the function will always
 * fail with a call to usage() as no value can be defined between \p min
 * and \p max in that case. The minimum and maximum values are inclusive,
 * so a range of 1 to 9 is defined with exactly 1 and 9 in min and max.
 * For example, the z library compression could be retrieved with:
 *
 * \code
 * int level(6); // default to 6
 * if(opt.is_defined("zlevel"))
 * {
 *   zlevel = opt.get_long("zlevel", 0, 1, 9);
 * }
 * \endcode
 *
 * Note that the function can be used to read unsigned numbers, however
 * at this point getopt does not really support negative numbers (i.e. because
 * -<number> is viewed as an option.)
 *
 * \exception getopt_exception_undefined
 * The getopt_exception_undefined exception is raised if \p name was not
 * found on the command line and it has no default, or if \p idx is
 * out of bounds.
 *
 * \param[in] name  The name of the option to retrieve.
 * \param[in] idx  The index of the argument to retrieve.
 * \param[in] min  The minimum value that will be returned (inclusive).
 * \param[in] max  The maximum value that will be returned (inclusive).
 *
 * \return The argument as a long.
 */
long getopt::get_long(std::string const & name, int idx, long min, long max)
{
    long result(0);
    int max_idx = size(name);
    if(max_idx == 0)
    {
        char const * d(get_default(name));
        if(d == nullptr)
        {
            throw getopt_exception_undefined("the \"" + name + "\" option was not defined on the command line");
        }
        char * end;
        result = strtol(d, &end, 10);
        if(end != d + strlen(d))
        {
            // here we throw because this default value is defined in the
            // options of the tool and not by the user
            throw getopt_exception_invalid("invalid default number \"" + std::string(d) + "\" in parameter --" + name);
        }
    }
    else if(static_cast<unsigned int>(idx) >= static_cast<unsigned int>(max_idx))
    {
        throw getopt_exception_undefined("not this many options were defined on the command line");
    }
    else
    {
        optmap_info & opt(f_map[name]);
        if(!opt.f_cvt)
        {
            // we did not yet convert to integers do that now
            for(int i = 0; i < max_idx; ++i)
            {
                char * end;
                char const * s(opt.f_val[i].c_str());
                opt.f_int.push_back(strtol(s, &end, 10));
                if(end != s + opt.f_val[i].size())
                {
                    usage(status_t::error, "invalid number (%s) in parameter --%s", s, name.c_str());
                    /*NOTREACHED*/
                }
            }
            opt.f_cvt = static_cast<int32_t>(true);
        }
        result = opt.f_int[idx];
    }
    if(result < min || result > max)
    {
        usage(status_t::error, "%ld is out of bounds (%ld..%ld inclusive) in parameter --%s", result, min, max, name.c_str());
        /*NOTREACHED*/
    }
    return result;
}


/** \brief Get the content of an option as a string.
 *
 * Get the content of the named parameter as a string. Command line options
 * that accept multiple arguments accept the \p idx parameter to
 * specify which item you are interested in.
 *
 * Note that the option must have been specified on the command line or have
 * a default value. For options that do not have a default value, you want
 * to call the is_defined() function first.
 *
 * \exception getopt_exception_undefined
 * The getopt_exception_undefined exception is raised if \p name was not
 * found on the command line and it has no default, or if \p idx is
 * out of bounds.
 *
 * \param[in] name  The name of the option to read.
 * \param[in] idx  The zero based index of a multi-argument command line option.
 *
 * \return The option argument as a string.
 */
std::string getopt::get_string(std::string const & name, int idx) const
{
    optmap_t::const_iterator it(f_map.find(name));
    if(it == f_map.end())
    {
        char const * d(get_default(name));
        if(d != nullptr)
        {
            return d;
        }
        throw getopt_exception_undefined("the --" + name + " option was not defined on the command line");
    }

    size_t const max_idx(it->second.f_val.size());
    if(static_cast<size_t>(idx) >= max_idx)
    {
        throw getopt_exception_undefined("not this many options were defined on the command line");
    }

    return it->second.f_val[idx];
}


/** \brief Change the %p in help strings in the program name.
 *
 * Because the same set of options may be used by different programs,
 * having the usage directly in the list of options may break the
 * usage name. So here we offer a dynamic way of changing the help
 * string with "%p". For example:
 *
 * \code
 *    "Usage: %p [-opt] filename ..."
 * \endcode
 *
 * \param[in] help  A string that may include '%p'.
 *
 * \return The string with any '%p' replaced with the program name.
 */
std::string getopt::process_help_string( char const * help ) const
{
    std::string result;

    while(help[0] != '\0')
    {
        if(help[0] == '%' && help[1] == 'p')
        {
            result += f_program_name;
            help += 2; // skip the % and p at the same time
        }
        else
        {
            result += help[0];
            ++help;
        }
    }

    return result;
}


/** \brief Assemble the cmdline arguments.
 *
 * Assembles the command line arguments into a string and returns
 * the string.
 *
 * \param[in] status  The status at the time the options are requested.
 * \param[out] default_arg_help
 */
std::string getopt::assemble_options( status_t status /*, std::string & default_arg_help*/ ) const
{
    std::stringstream ss;

    unsigned char errflag(0);
    bool const no_error_status(status == status_t::no_error || status == status_t::no_error_nobr);
    if( !no_error_status )
    {
        errflag = GETOPT_FLAG_SHOW_USAGE_ON_ERROR;
    }

    for( int i(0); f_options[i].f_arg_mode != argument_mode_t::end_of_options; ++i )
    {
        // ignore entries with a nullptr pointer
        // ignore entries representing an alias
        // only display error marked entries if error status
        const auto& opt( f_options[i] );
        if(opt.f_help
            && (opt.f_flags & advgetopt::getopt::GETOPT_FLAG_ALIAS) == 0
            && (((opt.f_flags & errflag) == 0) ^ !no_error_status))
        {
            if( opt.f_arg_mode == argument_mode_t::help_argument )
            {
                ss << process_help_string(opt.f_help) << std::endl;
            }
            else
            {
                std::stringstream opt_ss;

                if( opt.f_arg_mode == argument_mode_t::default_argument )
                {
                    opt_ss << "[default argument]";
                }
                else if( opt.f_arg_mode == argument_mode_t::default_multiple_argument)
                {
                    opt_ss << "[default arguments]";
                }
                else
                {
                    if(opt.f_opt != '\0' && opt.f_name != nullptr)
                    {
                        // both options!
                        opt_ss << "--" << opt.f_name << " or -" << opt.f_opt;
                    }
                    else if(opt.f_opt != '\0')
                    {
                        opt_ss << "-" << opt.f_opt;
                    }
                    else if(opt.f_name != nullptr)
                    {
                        opt_ss << "--" << opt.f_name;
                    }
                    else
                    {
                        // TODO: the 'default_arg_help' is not used and I am
                        //       really thinking we should have the throw back in...
                        //
                        throw getopt_exception_invalid("an option has help but no option name");
                        //default_arg_help = process_help_string(opt.f_help);
                        //continue;
                    }
                    switch(opt.f_arg_mode)
                    {
                        case argument_mode_t::no_argument:
                            break;

                        case argument_mode_t::required_argument:
                        case argument_mode_t::required_long:
                            opt_ss << " <arg>";
                            break;

                        case argument_mode_t::optional_argument:
                        case argument_mode_t::optional_long:
                            opt_ss << " [<arg>]";
                            break;

                        case argument_mode_t::required_multiple_argument:
                        case argument_mode_t::required_multiple_long:
                            opt_ss << " <arg> {<arg>}";
                            break;

                        case argument_mode_t::optional_multiple_argument:
                        case argument_mode_t::optional_multiple_long:
                            opt_ss << " {<arg>}";
                            break;

                        default:
                            throw getopt_exception_invalid("an option uses an invalid argument mode");
                    }
                }

                // Output argument string with help
                //
                int const option_width(30); // <- this could be dynamically calculated (i.e. largest option) and capped instead of forced to 30
                int const line_width(80);
                ss << "   ";
                std::string options( opt_ss.str() );
                if( options.size() < option_width - 3 )
                {
                    ss << options << std::setw( option_width - 3 - options.size() ) << " ";
                }
                else
                {
                    // write help on following line since this line is too
                    // short
                    ss << options << std::endl << std::setw( option_width ) << " ";
                }
                //
                // break up the line if longer than line_width characters
                //
                std::string help(process_help_string(opt.f_help));
                while(help.size() > line_width - option_width)
                {
                    if(std::isspace(help[line_width - option_width]))
                    {
                        ss << help.substr(0, line_width - option_width) << std::endl;
                        help = help.substr(line_width - option_width + 1);
                    }
                    else
                    {
                        std::string::size_type const pos(help.find_last_of(' ', line_width - option_width));
                        ss << help.substr(0, pos) << std::endl;
                        help = help.substr(pos + 1);
                    }
                    if(!help.empty())
                    {
                        ss << std::setw( option_width ) << " ";
                    }
                }
                if(!help.empty()) // this only happens if you end a help string with spaces
                {
                    ss << help << std::endl;
                }
            }
        }
    }

    return ss.str();
}


/** \brief Print the tool usage and then exit the program.
 *
 * This function prints the usage of this tool and then calls exit(1).
 * In case of our tests, the exit(1) can be transformed in a throw that
 * we can easily capture.
 *
 * \todo
 * Change the format string with a message option. As far as I know the
 * wpkg_output does not use the getopt classes so we could use that.
 *
 * \param[in] status  The status when calling this function.
 * \param[in] msg  A printf() string format (with %s, %d, etc.).
 */
void getopt::usage(status_t status, char const * msg, ...)
{
    //std::string default_arg_help;
    std::string options( assemble_options( status /*, default_arg_help*/ ) );

    bool const no_error_status(status == status_t::no_error || status == status_t::no_error_nobr);
    if( !no_error_status )
    {
        char const * errstr(nullptr);
        switch(status)
        {
        // other cases are eliminated by the test before this if() block
        //case no_error:
        //case no_error_nobr:

        case status_t::warning:
            errstr = "warning";
            break;

        case status_t::fatal:
            errstr = "fatal error";
            break;

        default: //case status_t::error:
            errstr = "error";
            break;

        }
        std::cerr << errstr << ":" << f_program_name << ": ";
        // TODO: fix that with some form of << or () operator support
        va_list ap;
        va_start(ap, msg);
        vfprintf(stderr, msg, ap);
        std::cerr << "." << std::endl;

        std::cerr << options << std::flush;
    }
    else
    {
        // A little flush helps greatly under MS-Windows
        //
        std::cout << options << std::flush;
    }

#ifdef ADVGETOPT_THROW_FOR_EXIT
    // for test purposes
    throw getopt_exception_exiting("usage was called, throwing an exception instead of calling exit(1)...");
#else
    exit(1);
#endif
}


/** \brief Get the full name of the program.
 *
 * This function return the name of the program exactly as it was passed to
 * the program via argv[0].
 *
 * The reset() function will reset this parameter. If you are creating
 * internal lists of parameters that you want to parse with the same
 * getopt object and your main getopt object, then you may want to
 * consider using this function to define argv[0] of your new list:
 *
 * \code
 * std::vector<std::string> args;
 * args.push_back(my_opts.get_program_fullname());
 * args.push_back("--test");
 * [...]
 * // the following probably require some const_cast<>(), but that's the idea
 * my_opts.reset(args.size(), &args[0], ...);
 * \endcode
 *
 * \return The contents of the argv[0] parameter as defined on construction.
 */
std::string getopt::get_program_fullname() const
{
    return f_program_fullname;
}


/** \brief Get the basename of the program.
 *
 * This function retrieves the basename, the name of the program with its
 * path trimmed, from this getopt object.
 *
 * This is defined from the argv[0] parameter passed to the constructor or
 * the last reset() call.
 *
 * \return The basename of the program.
 */
std::string getopt::get_program_name() const
{
    return f_program_name;
}


/** \brief Retrieve the project name if one is defined.
 *
 * This function returns the name of the project as defined in the list
 * of configuration files under '@' characters. For example, the
 * snapwebsites project makes use of "@snapwebsites@" as one of its
 * configuration filename. This ensures that the configuration files
 * are searched for under the indicated folders and again under:
 *
 * \code
 *      <existing path>/@<project name>@/<basename>
 * \endcode
 *
 * So if you have a configuration file named "snapserver.conf" with
 * a path such as "/etc/snapwebsites", you end up with:
 *
 * \code
 *      "/etc/snapwebsites/snapserver.conf"
 *      "/etc/snapwebsites/snapwebsites.d/snapserver.conf"
 * \endcode
 *
 * Notice that the loader adds a ".d" at the end of the project name.
 * Also, if the user were to specify a different filename with the
 * --config command line option, it could end up like this:
 *
 * \code
 *      ... --config /home/alexis/.config/iplock/iplock.conf ...
 *
 *      # First we read this file:
 *      "/home/alexis/.config/iplock/iplock.conf"
 *
 *      # Second we read this file (assuming the same project name
 *      # of "@snapwebsites@"):
 *      "/home/alexis/.config/iplock/snapwebsites.d/iplock.conf"
 * \endcode
 *
 * Since we test with the additional project name in the path, it
 * can be defined anywhere in the list of configuration filenames.
 *
 * \return The name of the project if one was defined in the vector of
 *         configuration filename.
 */
std::string getopt::get_project_name() const
{
    return f_project_name;
}


/** \brief Read parameters of the current option.
 *
 * This function saves the option in the list of options found in this list
 * of arguments. If the option is expected to have parameters, then those
 * are taken from the argv array before the function saves the option in
 * the object list. The index, \p i, is increased accordingly.
 *
 * \warning
 * This function cannot be called properly with the '-' option in case it
 * is viewed as a default parameter. This is because the algorithm expects
 * the index (\p i) to be pointing to the command line option and not the
 * argument to that command.
 *
 * \param[in] opt  The concerned option
 * \param[in] i  The current position, starting with the option position
 * \param[in] argc  The number of arguments in the argv array.
 * \param[in] argv  The list of argument strings.
 */
void getopt::add_options(option const * opt, int & i, int argc, char ** argv)
{
    switch(opt->f_arg_mode)
    {
    case argument_mode_t::no_argument:
        // this value should not be taken in account
        add_option(opt, opt->f_default);
        break;

    case argument_mode_t::required_argument:
    case argument_mode_t::required_long:
        if(i + 1 >= argc || is_arg(argv[i + 1]))
        {
            if(opt->f_name != nullptr)
            {
                usage(status_t::error, "option --%s expects an argument", opt->f_name);
            }
            else
            {
                usage(status_t::error, "option -%c expects an argument", opt->f_opt);
            }
            /*NOTREACHED*/
        }
        ++i;
        add_option(opt, argv[i]);
        break;

    case argument_mode_t::optional_argument:
    case argument_mode_t::optional_long:
    case argument_mode_t::default_argument:
        if(i + 1 < argc && !is_arg(argv[i + 1]))
        {
            ++i;
            add_option(opt, argv[i]);
        }
        else {
            add_option(opt, opt->f_default);
        }
        break;

    case argument_mode_t::required_multiple_argument:
    case argument_mode_t::required_multiple_long:
        if(i + 1 >= argc || is_arg(argv[i + 1]))
        {
            if(opt->f_name != nullptr)
            {
                usage(status_t::error, "option --%s requires at least one argument", opt->f_name);
            }
            else
            {
                usage(status_t::error, "option -%c requires at least one argument", opt->f_opt);
            }
            /*NOTREACHED*/
        }
        do
        {
            ++i;
            add_option(opt, argv[i]);
        } while(i + 1 < argc && !is_arg(argv[i + 1]));
        break;

    case argument_mode_t::optional_multiple_argument:
    case argument_mode_t::optional_multiple_long:
    case argument_mode_t::default_multiple_argument:
        {
            bool got_option = false;
            while(i + 1 < argc && !is_arg(argv[i + 1]))
            {
                ++i;
                got_option = true;
                add_option(opt, argv[i]);
            }
            if(!got_option)
            {
                add_option(opt, opt->f_default);
            }
        }
        break;

    default:
        throw getopt_exception_invalid("an option has an unexpected argument mode");

    }
}


/** \brief Add one option to the internal list of options.
 *
 * This function adds the actual option name and value pair to the
 * option list.
 *
 * The name of the option is taken from the first one of these that is
 * defined:
 *
 * \li For options marked as an alias, use the f_help alias
 * \li For options with a long name, use the f_name string
 * \li For options with a short name, use the f_opt character as a name
 * \li In all other cases, use "--" as a fallback
 *
 * If the function is called multiple times with the same option and that
 * option is not marked as a "multiple" argument option, then the function
 * overwrites the current value with the latest passed to this function.
 * In other words, only the last argument in your configuration files,
 * environment variable, or command line options is kept.
 *
 * Options having a "multiple" flag accept multiple calls and each instance
 * is saved in the order found in your configuration files, environment
 * variable, and command line options.
 *
 * \note
 * The value pointer can be set to nullptr in which case it is considered to
 * be equivalent to "" (the empty string.)
 *
 * \note
 * Options that are marked as "no argument" ignore the value parameter
 * altogether.
 *
 * \param[in] opt  The concerned option.
 * \param[in] value  The value to add to that option info.
 */
void getopt::add_option(option const * opt, char const * value)
{
    std::string name;
    if((opt->f_flags & advgetopt::getopt::GETOPT_FLAG_ALIAS) != 0)
    {
        // use the help string as the alias
        name = opt->f_help;
    }
    else if(opt->f_name == nullptr)
    {
        if(opt->f_opt == '\0')
        {
            // default argument name is "--" if not otherwise specified
            name = "--";
        }
        else
        {
            name = opt->f_opt;
        }
    }
    else
    {
        name = opt->f_name;
    }

    // nullptr is not valid with push_back() for an std::string
    if(value == nullptr)
    {
        value = "";
    }

    if(f_map.find(name) == f_map.end())
    {
        // this is a new entry
        optmap_info info;
        info.f_val.push_back(value);
        f_map[name] = info;
    }
    else
    {
        // TODO: unless we are adding a multiple argument, we should
        //       warning about the problem because it is not unlikely
        //       a mistake by the end user (TBD)
        switch(opt->f_arg_mode)
        {
        case argument_mode_t::no_argument:
            // do not waste time, return immediately
            break;

        case argument_mode_t::required_argument:
        case argument_mode_t::required_long:
        case argument_mode_t::optional_argument:
        case argument_mode_t::optional_long:
        case argument_mode_t::default_argument:
            // we do not expect more than one, overwrite previous value
            // if necessary
            f_map[name].f_val[0] = value;
            break;

        case argument_mode_t::required_multiple_argument:
        case argument_mode_t::required_multiple_long:
        case argument_mode_t::optional_multiple_argument:
        case argument_mode_t::optional_multiple_long:
        case argument_mode_t::default_multiple_argument:
            f_map[name].f_val.push_back(value);
            break;

        default:
            // the add_option() is called directly only for def_opt which
            // has to have a valid more so we are not expected to get here
            // (i.e. there is a similar throw in the add_options() function
            throw getopt_exception_invalid("an option has an unexpected argument mode"); // LCOV_EXCL_LINE

        }
    }
}


/** \brief Get the major version of the library
 *
 * This function returns the version of the running library (the
 * one you are linked against at runtime).
 *
 * \return The major version.
 */
int getopt::get_major_version()
{
    return LIBADVGETOPT_VERSION_MAJOR;
}


/** \brief Get the release version of the library.
 *
 * This function returns the release version of the running library
 * (the one you are linked against at runtime).
 *
 * \return The release version.
 */
int getopt::get_release_version()
{
    return LIBADVGETOPT_VERSION_MINOR;
}


/** \brief Get the patch version of the library.
 *
 * This function returns the patch version of the running library
 * (the one you are linked against at runtime).
 *
 * \return The patch version.
 */
int getopt::get_patch_version()
{
    return LIBADVGETOPT_VERSION_PATCH;
}


/** \brief Get the full version of the library as a string.
 *
 * This function returns the major, release, and patch versions of the
 * running library (the one you are linked against at runtime) in the
 * form of a string.
 *
 * The build version is not made available.
 *
 * \return The library version.
 */
char const * getopt::get_version_string()
{
    return LIBADVGETOPT_VERSION_STRING;
}


} // namespace advgetopt
// vim: ts=4 sw=4 et
