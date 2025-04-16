import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import L from "leaflet";
import m2x from "leaflet/dist/images/marker-icon-2x.png";
import m1x from "leaflet/dist/images/marker-icon.png";
import shadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({ iconRetinaUrl: m2x, iconUrl: m1x, shadowUrl: shadow });

export default function MapPage() {
  const [client, setClient] = useState(null);
  const [targets, setTargets] = useState([]);

  // 读取 localStorage 并解析
  useEffect(() => {
    try {
      const raw = localStorage.getItem("ipData");
      if (!raw) return;
      const { client: me, ips } = JSON.parse(raw);

      // 解析 client 坐标
      if (me && me.loc && me.lat == null) {
        const [la, lo] = me.loc.split(",");
        me.lat = +la; me.lon = +lo;
      }
      setClient(me);

      // 解析 targets 坐标
      const cleaned = (ips||[]).map(p=>{
        if (p.lat==null && p.loc){
          const [la,lo] = p.loc.split(",");
          p.lat = +la; p.lon = +lo;
        }
        return p;
      }).filter(p=>p.lat!=null && p.lon!=null);
      setTargets(cleaned);
    } catch(e){ console.error(e); }
  }, []);

  // 绿色圆点 icon 用 divIcon
  const clientIcon = L.divIcon({
    className:"",
    html:'<div style="background:#28a745;width:18px;height:18px;border-radius:50%;border:2px solid white"></div>',
    iconSize:[18,18]
  });
  const restIPIcon = L.divIcon({
    className:"",
    html:'<div style="background:#C5D8D7;width:18px;height:18px;border-radius:50%;border:2px solid white"></div>',
    iconSize:[18,18]
  });
  return (
    <MapContainer center={[20,0]} zoom={2} style={{height:"100vh",width:"100vw"}}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      
      {client && client.lat && (
        <Marker position={[client.lat,client.lon]} icon={clientIcon}>
          <Popup><b>You</b><br/>{client.city},{client.country}<br/>{client.ip}</Popup>
        </Marker>
      )}

      {targets.map((p,i)=>(
        <Marker key={i} position={[p.lat,p.lon]} icon = {restIPIcon}>
          <Popup>
            <b>{p.ip}</b><br/>{p.city},{p.country}<br/>{p.org}
          </Popup>
        </Marker>
      ))}

      {/* Red lines: client → each target */}
      {client && targets.map((t,i)=>(
        <Polyline key={i}
          positions={[[client.lat,client.lon],[t.lat,t.lon]]}
          pathOptions={{color:"red",weight:2}}
        />
      ))}
    </MapContainer>
  );
}
