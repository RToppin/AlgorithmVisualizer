from django.http import JsonResponse
from .algorithms import REGISTRY #import the list of algorithms that I can grab
from django.shortcuts import render

def home(request):
    return render(request, "visualizer/home.html")

def get_algorithms(request):
    return JsonResponse(REGISTRY, safe=False)

