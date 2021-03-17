from django.urls import path
from .views import (
    RoomView, CreateView, RoomCrud,
    JoinRoom, UserInRoom, LeaveRoom
)

urlpatterns = [
    path('rooms', RoomView.as_view()),
    path('rooms/create', CreateView.as_view()),
    path('rooms/<str:code>', RoomCrud.as_view()),
    path('rooms/join/<str:code>', JoinRoom.as_view()),
    path('user-in-room', UserInRoom.as_view()),
    path('leave-room', LeaveRoom.as_view())
]
