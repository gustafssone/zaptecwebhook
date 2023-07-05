# zaptecwebhook

Zaptec switch to webhook api

The built in options for starting charging on a Zaptec charger are:
 - Native (starts charging immediately upon cable connected to car)
 - Native with permission (requires RFID and/or app - meaning manual start)
 - Webhook auth (can be with RFID and/or Authentication)
 - Webhook auth (only URL) <- THIS REPOSITORY
 - OCPP-J 1.6 (there is a custom component directory in HA, _should work_, but haven't got it to work)

This container allows us to call an URL to start charging on demand, i.e. when electricity prices are low.
We can start it from Home Assistant with a restful command.
The URL is just responding with a start command according to zaptec API, only sending a HTTP status code 200 with a random sessionId.
More info at https://zaptec.com/downloads/ZapChargerPro_Integration.pdf

Main reasons for using a docker container instead of a custom component for HA:
 - Not familiar enough in python
 - Can expose the external url fully (read only) with a reverse proxy (e.g. Traefik), instead of limiting access (my HA instance has an ip-allowlist)

## Example configuration.yaml entry in Home Assistant

```
rest_command:
  start_charging:
    url: "http://192.168.1.100:91/internal/ij2YChMgxNBTfQtH5Qv6U7oQPv2kdPnWgrjMs8iwKebkh5UVnnZ6UMdaNCMVunen/on"
    method: get
  end_charging:
    url: "http://192.168.1.100:91/internal/ij2YChMgxNBTfQtH5Qv6U7oQPv2kdPnWgrjMs8iwKebkh5UVnnZ6UMdaNCMVunen/off"
    method: get
```

Remember to add an automation to turn it off, attached in file homeassistant_automations.yaml are examples.

In Zaptec Portal UI add the public URLs:

![alt text](https://github.com/gustafssone/zaptecwebhook/blob/main/zaptecportal.png?raw=true)

E.g:

Start:

https://zaptec.mydomain.com/external/djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf/start

End:

https://zaptec.mydomain.com/external/djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf/end

I have a Zaptec Go, it flashes white while waiting for authorization. It takes a few minutes for the Zaptec Cloud to pick up the authentication (patience!), then the charging box should turn blue.

Generate random ids for obfuscation instead of my examples
Start it with node for validation if you want:
```
INTID=ij2YChMgxNBTfQtH5Qv6U7oQPv2kdPnWgrjMs8iwKebkh5UVnnZ6UMdaNCMVunen EXTID=djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf node app.js
```

In this directory, a Dockerfile for building and a service example exists (I am using Docker Swarm). Traefik Reverse Proxy exposes this service online.
Container at https://hub.docker.com/r/erikadvectas/zaptecwebhook 

## Full start flow
```
zaptec_01_resume_charging:
  alias: "Zaptec 01 Resume Charging"
  sequence:
      #Cable is connected to car
      #Zaptec is waiting for the webhook to start charging
      #HA says to this container through a rest command that it is OK to start charging
    - service: rest_command.start_carcharging1
      #HA sends start charging through https://github.com/custom-components/zaptec
      #Technically Zaptec Cloud already tries to do this, but this forces an update to check if webhook is set to start
    - service: zaptec.resume_charging
      data:
        charger_id: yyyyyyyy-9999-99xx-xxxx-yyyyyyyyyyyy
      #Charging should start, sometimes immediately, sometimes 20 minutes later
```

## Manual stop flow
```
zaptec_01_stop_pause_charging:
  alias: "Zaptec 01 Stop Pause Charging"
  sequence:
      #Currently charging...
      #HA tells container through a rest command that it is no longer accepting start commands
      #If not done - Zaptec would immediately start charging next time cable is connected
    - service: rest_command.end_carcharging1
      #Actually tells Zaptec to manually stop charging
    - service: zaptec.stop_pause_charging
      data:
        charger_id: yyyyyyyy-9999-99xx-xxxx-yyyyyyyyyyyy
```
