"""
invariants module to ensure LinkLink invariants
"""

from django.conf import settings

from .models import (
    FriendRequest,
)

def max_onechon_invariant(linklinkuser, friend_request):
    """
    For any given point in time and user,
    number of onechon <= settings.MAX_ONECHON
    """
    max_onechon = settings.MAX_ONECHON
    # Get all Accepted FriendRequest
    all_accepted_friend_requests = FriendRequest.objects.filter(
        status="Accepted"
    )
    # Get onechon of current user
    # pylint: disable=import-outside-toplevel
    # to avoid circular import
    from .utils import get_onechon_linklinkuser_list
    onechon_list = get_onechon_linklinkuser_list(
        all_accepted_friend_requests,
        linklinkuser
    )
    max_onechon_violated = len(onechon_list) >= max_onechon and \
        friend_request.status=="Pending"
    return max_onechon_violated, onechon_list
