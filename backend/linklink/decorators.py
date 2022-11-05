"""
decorators module to keep custom decorators for linklink app
"""

from functools import wraps

from django.http import (
    HttpResponse,
    HttpResponseNotAllowed
)

def allowed_method_or_405(allowed_methods):
    """
        custom decorator that wraps a decorator to take in argument
        Args:
        allowed_methods:List[str]
    """
    def allowed_method_decorator(func):
        """
            custom decorator to give 405 to all but allowed_methods
        """
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            if request.method in allowed_methods:
                val = func(request, *args, **kwargs)
            else: # not allowed method
                val = HttpResponseNotAllowed(allowed_methods)
            return val
        return wrapper
    return allowed_method_decorator

def logged_in_or_401(func):
    """
        custom decorator to give 401 to not logged in users
    """
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            val = func(request, *args, **kwargs)
        else: # not logged in
            val = HttpResponse(status=401) # unauthorized
        return val
    return wrapper
