from django.shortcuts import render

# # Create your views here.

#define views, links them to html files
def pong(request):
    return render(request, 'pong.html')
def index(request):
    return render(request, 'index.html')
def view_404(request):
    return render(request, '404.html')
    # return HttpResponse("Hello, world. You're at the myapp index.")
