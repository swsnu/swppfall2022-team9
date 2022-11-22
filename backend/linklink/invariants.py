"""
invariants module to ensure LinkLink invariants
"""

from django.conf import settings
from django.http import JsonResponse

from .models import (
    FriendRequest,
)

def max_onechon_invariant(linklinkuser):
    """
    For any given point in time and user,
    number of onechon <= settings.MAX_ONECHON
    if not met,
    raise ValueError with logs
    """
    max_onechon = settings.MAX_ONECHON
    # Get all Accepted FriendRequest
    all_accepted_friend_requests = FriendRequest.objects.filter(
        status="Accepted"
    )
    # Get onechon of current user
    # pylint: disable=import-outside-toplevel
    # to avoid circular import
    from .views import get_onechon_linklinkuser_list
    onechon_list = get_onechon_linklinkuser_list(
        all_accepted_friend_requests,
        linklinkuser
    )
    if len(onechon_list) > max_onechon:
        max_onechon_error_message = (
            f"Onechon Invariant Failed for {linklinkuser}."
            f"Onechon list length: {len(onechon_list)}"
            f"Onechon list of {linklinkuser}:"
            f"{onechon_list}"
        )
        return JsonResponse(
            status=403,
            data={"message":max_onechon_error_message}
        )
