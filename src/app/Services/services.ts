import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule, /* other http imports */ } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
export type ResponseType = 'arraybuffer' | 'blob' | 'json' | 'text';;
import 'rxjs/add/operator/map'
import { String } from 'aws-sdk/clients/apigateway';
const URL="http://localhost:3002"
//const URL="http://54.214.162.22:3002"
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
          
              //console.log(" getCustomersList",resp)
              return resp;
          });
    }
    updateCustomer(id:string, body:object) {
      return this.http.put<any>(URL+'/client/'+id,body)
          .map(resp => {
          
              //console.log("updateCustomer",resp)
              return resp;
          });
    }
    deleteCustomer(id:string) {
      return this.http.delete<any>(URL+'/client/'+id)
          .map(resp => {
          
              //console.log("deleteCustomer",resp)
              return resp;
          });
    }
    createCustomer(body:object) {
        console.log("Client Addd+++++++++++")
      return this.http.post<any>(URL+'/client',body)
          .map(resp => {
          
              //console.log("createCustomer",resp)
              return resp;
          });
    }
    getCustomer(id:string) {
        return this.http.get<any>(URL+'/client/'+id)
            .map(resp => {
            
               //console.log("getAgency",resp)
                return resp;
            });
      }
    getAgency(id:string) {
      return this.http.get<any>(URL+'/agency/'+id)
          .map(resp => {
          
             //console.log("getAgency",resp)
              return resp;
          });
    }
    updateAgency(id:string, body:object) {
        return this.http.put<any>(URL+'/agency/'+id,body,httpOptions)
            .map(resp => {
             
                //console.log("updateAgency",resp)
                return resp;
            });
      }
    getPortafoliosList(id:string) {
      return this.http.get<any>(URL+'/portafolios/'+id )
          .map(resp => {
          
              //console.log(" getPortafoliosList",resp)
              return resp;
          });
    }
    getPortafolio(id:string) {
        return this.http.get<any>(URL+'/portafolio/'+id )
            .map(resp => {
            
                //console.log(" getPortafoliosList",resp)
                return resp;
            });
      }
    getPortafoliosListAgency(id:string) {
      return this.http.get<any>(URL+'/portafolios/agency/'+id )
          .map(resp => {
          
              //console.log(" getPortafoliosListAgency",resp)
              return resp;
          });
    }
    updatePortafolio(id:string, body:object) {
      return this.http.put<any>(URL+'/portafolio/'+id,body)
          .map(resp => {
          
              //console.log("updatePortafolio",resp)
              return resp;
          });
    }
    deletePortafolio(id:string) {
      return this.http.delete<any>(URL+'/portafolio/'+id)
          .map(resp => {
          
              //console.log("deletePortafolio",resp)
              return resp;
          });
    }
    createPortafolio(body:object) {
      return this.http.post<any>(URL+'/portafolio',body)
          .map(resp => {
          
              //console.log("createPortafolio",resp)
              return resp;
          });
    }
    createMap(body:object) {
      return this.http.post<any>(URL+'/map/',body)
          .map(resp => {
          
             //console.log("createMap",resp)
              return resp;
          });
    }
    updateMap(body:object, id: string) {
        return this.http.put<any>(URL+'/map/'+id,body)
            .map(resp => {
            
               //console.log("createMap",resp)
                return resp;
            });
      }
    getDataMap(id:string) {
        return this.http.get<any>(URL+'/map/data/'+id)
            .map(resp => {
            
               //console.log("getMap",resp)
                return resp;
            });
      }
      getMap(id:string) {
        return this.http.get<any>(URL+'/map/'+id)
            .map(resp => {
            
               //console.log("getMap",resp)
                return resp;
            });
      }
    getASegmentacion(criterio:string,id:string) {
    return this.http.get<any>(URL+'/map/'+id+'/'+criterio)
        .map(resp => {
        
            //console.log("getMap",resp)
            return resp;
        });
    }
    getASegment(body:object,id:string) {
        console.log("STRING",id)
        return this.http.post<any>(URL+'/map/graph/'+id, body)
            .map(resp => {
            
                //console.log("getMap",resp)
                return resp;
            });
        }
    getASegmentacion2(id:string, body:object) {
        return this.http.post<any>(URL+'/map/s2/A/'+id,body)
            .map(resp => {
            
                //console.log("getMap",resp)
                return resp;
            });
        }
    getASR(criterio:string,id:string, rango1:string, rango2:string) {
        return this.http.get<any>(URL+'/map/'+id+'/'+criterio+'/'+rango1+'/'+rango2)
            .map(resp => {
            
                //console.log("getMap",resp)
                return resp;
            });
        }
    getASR2(id:string, body:object) {
        console.log(body)
        return this.http.post<any>(URL+'/map/s2/'+id, body)
            .map(resp => {
            
                //console.log("getMap",resp)
                return resp;
            });
        }
    createRegister(body:object, id:string) {
      return this.http.post<any>(URL+'/map/'+id,body)
          .map(resp => {
          
             //console.log("createRegister",resp)
              return resp;
          });
    }
    updateRegister(body:object, id:string) {
      return this.http.put<any>(URL+'/map/data/'+id,body)
          .map(resp => {
          
             //console.log("createRegister",resp)
              return resp;
          });
    }
    //Planes
    getPlansList() {
        return this.http.get<any>(URL+'/plans')
            .map(resp => {
             
                //console.log(" getPlansList",resp)
                return resp;
            });
    }
    getPlan(id:string) {
        return this.http.get<any>(URL+'/plan/'+id,httpOptions)
            .map(resp => {
             
                //console.log("updatePlan",resp)
                return resp;
  
            });
      }

      //Segmentacion
    getSegmentationsList(id:string) {
        return this.http.get<any>(URL+'/segmentations/'+id)
            .map(resp => {
             
                //console.log(" getPlansList",resp)
                return resp;
            });
    }
    getSegmentation(id:string) {
        return this.http.get<any>(URL+'/segmentation/'+id,httpOptions)
            .map(resp => {
             
                //console.log("updatePlan",resp)
                return resp;
  
            });
      }

      getPortafolioSegmentation(id:string) {
        return this.http.get<any>(URL+'/segmentation/portafolio/'+id,httpOptions)
            .map(resp => {
             
                //console.log("updatePlan",resp)
                return resp;
  
            });
      }

      updateSegmentation(id:string, body:object) {
        return this.http.put<any>(URL+'/segmentation/'+id,body)
            .map(resp => {
            
                //console.log("updateCustomer",resp)
                return resp;
            });
      }
      newSegmentation(id:string, body:object) {
        return this.http.put<any>(URL+'/segmentation/new/'+id,body)
            .map(resp => {
            
                //console.log("updateCustomer",resp)
                return resp;
            });
      }
      deleteSegmentation(id:string) {
        return this.http.delete<any>(URL+'/segmentation/'+id)
            .map(resp => {
            
                //console.log("deleteCustomer",resp)
                return resp;
            });
      }
      createSegmentation(body:object) {
        return this.http.post<any>(URL+'/segmentation/',body)
            .map(resp => {
            
                //console.log("createCustomer",resp)
                return resp;
            });
      }
      //Segmentacion
        getCommunicationList(id:string) {
            return this.http.get<any>(URL+'/communications/'+id)
                .map(resp => {
                
                    //console.log(" getPlansList",resp)
                    return resp;
                });
        }
        getCommunication(id:string) {
            return this.http.get<any>(URL+'/communication/'+id,httpOptions)
                .map(resp => {
                
                    //console.log("updatePlan",resp)
                    return resp;
    
                });
      }
      updateDataCommunication(id:string,data:string,body:object) {
        return this.http.put<any>(URL+'/communication/'+data+"/"+id,body,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }
    createDataCommunication(body:object) {
        return this.http.post<any>(URL+'/communication/',body,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }
    getInvoice(id:string) {
        return this.http.get<any>(URL+'/history/agency/'+id,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
    }
    printValidate(body:object) {
        return this.http.post<any>(URL+'/print',body,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }
    getPrnt(id:string) {
        return this.http.get<any>(URL+'/print/'+id,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }
    createStrategy(body:object) {
        return this.http.post<any>(URL+'/strategy',body,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }
    getStrategy(id:string) {
        return this.http.get<any>(URL+'/strategy/'+id,httpOptions)
            .map(resp => {
            
                //console.log("updatePlan",resp)
                return resp;

            });
            
    }

}