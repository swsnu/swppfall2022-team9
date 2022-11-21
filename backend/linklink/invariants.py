"""
invariants module to ensure LinkLink invariants
"""

from django.conf import settings

from .models import (
    FriendRequest,
)
from .views import get_onechon_linklinkuser_list

def max_onechon_invariant(linklinkuser):
    """
    For any given point in time and user,
    number of onechon <= settings.MAX_ONECHON
    if not met,
    raise ValueError with logs
    """
    MAX_ONECHON = settings.MAX_ONECHON
    # Get all Accepted FriendRequest
    all_accepted_friend_requests = FriendRequest.objects.filter(
        status="Accepted"
    )
    # Get onechon of current user
    onechon_list = get_onechon_linklinkuser_list(
        all_accepted_friend_requests,
        linklinkuser
    )
    if len(onechon_list) > MAX_ONECHON:
        max_onechon_error_message = (
            f"Onechon Invariant Failed for {linklinkuser}."
            f"Onechon list length: {len(onechon_list)}"
            f"Onechon list of {linklinkuser}:"
            f"{onechon_list}"
        )
        raise ValueError(max_onechon_error_message)    
