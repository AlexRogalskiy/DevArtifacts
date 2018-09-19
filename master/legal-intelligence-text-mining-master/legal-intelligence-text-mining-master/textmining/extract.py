"""
This file contains tools for handling text documents and extracting features from it.
"""


def parse_zip_file(path, handler):
    """
    Parse all files contained in a zip file (specified by the path parameter).

    Parameters
    ----------
    path : str
        The path to the zip file.
    handler: function
        When looping through all the files contained in the zip file, this method will be called every time
        a new file is found. Two arguments are passed. The first argument is the name of the discovered file
        and the second argument are the contents of the file.

    Returns
    -------
    None
        Nothing is returned.
    """
    return None
