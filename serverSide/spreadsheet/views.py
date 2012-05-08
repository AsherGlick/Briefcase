####
# spreadsheet.views
######


from serverSide.accounts.models import UserProfile
from serverSide.spreadsheet.models import Spreadsheet
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, redirect
from django.contrib.auth.models import User
from django.core.context_processors import csrf
from django.template import RequestContext, Context, loader

import json



def autosave(request):
    if request.is_ajax():
        fname = request.POST['filename'] #get the filename
        input = request.POST['filedata'] # get the data
        owner = request.POST['fileowner'] #get file owner
        cur_profile=UserProfile.objects.get(user=request.user)
        own_profile=UserProfile.objects.get(user=User.objects.get(username=owner))
        sp = Spreadsheet.object.get(owner=own_profile, file_name=fname)
        #if not allowed - forbitdden
        if s.public==False and cur_profile not in s.allowed_users.all():
            return HttpResponseForbidden()
            
        d = sp.data
        cur_data = json.loads(d)
        #parse new data
        changes = json.load(input)
        #make changes to cur_data
        for key in changes:
            cur_data[key]=changes[key] # will update old value or make new key,value
        #save the file
        sp.data = cur_data
        sp.save()
        
        #return 
        
        return HttpResponse(json.dumps(cur_data));
    else return HttpResponseBadRequest
                
                
        
        
        
def save(request):
    if request.is_ajax():
        fname=request.POST['filename'] #get the filename
        input=request.POST['filedata'] #get the data
        profile = request.user.get_profile() # gets the UserProfile related to request.user
        #check to see if it exists
        try:
            sp = Spreadsheet.objects.get(owner=profile, file_name=fname)
        except Spreadsheet.DoesNotExist:
            #create new spreadsheet
            s = Spreadsheet(owner=profile, file_name=fname, data=input, public=False)
            s.save()
            s.allowed_users.add(profile)
            s.save()
            return HttpResponse()
       #file exists, overwrite the data
        sp=Spreadsheet.objects.get(owner=profile, file_name=fname)
        sp.data = input
        sp.save()
    return HttpResponse()

    
def load(request):
    if request.is_ajax():
        fname=request.POST['filename']#get the name of requested file
        uname=request.POST['username'] #get the user that owns the file
        cur_profile=UserProfile.objects.get(user=request.user)
        own_profile=UserProfile.objects.get(user=User.objects.get(username=uname))
        s=Spreadsheet.objects.get(pk=fname)
        if s.public==True or cur_profile in s.allowed_users.all():
            return HttpResponse(s.data) #send to frontend the entire file
        else:
            return HttpResponseForbidden()
        return HttpResponse(s.data)
    else:
        return HttpResponseBadRequest()
        
def blank_spreadsheet(request):
    if not request.user.is_authenticated():
        return render_to_response('welcome.html',{'form':AuthenticationForm()}, context_instance=RequestContext(request))
    #create new spreadsheet
    s=Spreadsheet(owner=profile, file_name='Untitled', data='', public=False)
    s.allowed_users.add(profile)
    s.save()
    return render_to_response('spreadsheet.html', context_instance=RequestContext(request))
