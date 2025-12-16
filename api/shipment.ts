import type { VercelRequest, VercelResponse } from '@vercel/node';

type LegStatus = 'scheduled' | 'in_flight' | 'landed' | 'cancelled';

type ShipmentLeg = {
  legNumber: number;
  from: string;
  to: string;
  flightNumber: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  estimatedDeparture: string;
  estimatedArrival: string;
  status: LegStatus;
  remark: string;
};

type ShipmentResponse = {
  awb: string;
  airlinePrefix: string;
  airlineName: string;
  shipmentStatus: 'booked' | 'in_transit' | 'delivered' | 'cancelled';
  summary: string;
  origin: string;
  finalDestination: string;
  legs: ShipmentLeg[];
  currentLegNumber: number | null;
  currentLocationHint: string | null;
  lastUpdated: string;
};

// Static demo object for this specific AWB 235-7167 9705
const DEMO_SHIPMENT: ShipmentResponse = {
  awb: '235-7167 9705',
  airlinePrefix: '235',
  airlineName: 'Turkish Airlines',
  shipmentStatus: 'in_transit',
  summary: 'Shipment is currently in the air on the first leg FRA → IST.',
  origin: 'FRA',
  finalDestination: 'BOM',
  legs: [
    {
      legNumber: 1,
      from: 'FRA',
      to: 'IST',
      flightNumber: 'TK6404',
      // Demo timestamps, adjust as you like
      scheduledDeparture: '2025-11-08T10:00:00Z',
      scheduledArrival: '2025-11-08T14:00:00Z',
      estimatedDeparture: '2025-11-08T10:10:00Z',
      estimatedArrival: '2025-11-08T14:20:00Z',
      status: 'in_flight',
      remark: 'Freighter departed Frankfurt and is en-route to Istanbul.'
    },
    {
      legNumber: 2,
      from: 'IST',
      to: 'BOM',
      flightNumber: 'TK6110',
      scheduledDeparture: '2025-11-09T02:00:00Z',
      scheduledArrival: '2025-11-09T08:30:00Z',
      estimatedDeparture: '2025-11-09T02:00:00Z',
      estimatedArrival: '2025-11-09T08:30:00Z',
      status: 'scheduled',
      remark: 'Planned connection from Istanbul to Bombay.'
    }
  ],
  currentLegNumber: 1,
  currentLocationHint: 'In flight between Frankfurt (FRA) and Istanbul (IST).',
  lastUpdated: '2025-11-08T11:30:00Z'
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const awbParam = (req.query.awb as string) || '';

  if (!awbParam) {
    res.status(400).json({
      error: 'Missing awb parameter. Example: /api/shipment?awb=235-7167-9705'
    });
    return;
  }

  if (awbParam != '235-7167-9705') {
    res.status(404).json({
      error: 'Shipment not found in this demo API.',
      hint: 'This demo only knows AWB 235-7167 9705.'
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.status(200).json(DEMO_SHIPMENT);
}