import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule, /* other http imports */ } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';;
import 'rxjs/add/operator/map'
const URL="http://localhost:3002"
const httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Headers":"origin, content-type, accept",
      "Access-Control-Allow-Origin":"*",
    })
  };
  

@Injectable()
export class Services {

  constructor(private http: HttpClient) { }

    getCustomersList(id:string) {
      return this.http.get<any>(URL+'/clients/'+id )
          .map(resp => {
          
              console.log(" getCustomersList",resp)
              return resp;
          });
    }
    updateCustomer(id:string, body:object) {
      return this.http.put<any>(URL+'/client/'+id,body)
          .map(resp => {
          
              console.log("updateCustomer",resp)
              return resp;
          });
    }
    deleteCustomer(id:string) {
      return this.http.delete<any>(URL+'/client/'+id)
          .map(resp => {
          
              console.log("deleteCustomer",resp)
              return resp;
          });
    }
    createCustomer(body:object) {
      return this.http.post<any>(URL+'/client/',body)
          .map(resp => {
          
              console.log("createCustomer",resp)
              return resp;
          });
    }
    getAgency(id:string) {
      return this.http.get<any>(URL+'/agency/'+id)
          .map(resp => {
          
              console.log("createAgency",resp)
              return resp;
          });
    }
    getPortafoliosList(id:string) {
      return this.http.get<any>(URL+'/portafolios/'+id )
          .map(resp => {
          
              console.log(" getPortafoliosList",resp)
              return resp;
          });
    }
    getPortafoliosListAgency(id:string) {
      return this.http.get<any>(URL+'/portafolios/agency/'+id )
          .map(resp => {
          
              console.log(" getPortafoliosListAgency",resp)
              return resp;
          });
    }
    updatePortafolio(id:string, body:object) {
      return this.http.put<any>(URL+'/portafolio/'+id,body)
          .map(resp => {
          
              console.log("updatePortafolio",resp)
              return resp;
          });
    }
    deletePortafolio(id:string) {
      return this.http.delete<any>(URL+'/portafolio/'+id)
          .map(resp => {
          
              console.log("deletePortafolio",resp)
              return resp;
          });
    }
    createPortafolio(body:object) {
      return this.http.post<any>(URL+'/portafolio/',body)
          .map(resp => {
          
              console.log("createPortafolio",resp)
              return resp;
          });
    }
    createMap(body:object) {
      return this.http.post<any>(URL+'/map/',body)
          .map(resp => {
          
              console.log("createMap",resp)
              return resp;
          });
    }
    createRegister(body:object, id:string) {
      return this.http.post<any>(URL+'/map/'+id,body)
          .map(resp => {
          
              console.log("createRegister",resp)
              return resp;
          });
    }

}