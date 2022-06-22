# zaptecwebhook

Zaptec switch to webhook api

The built in options for starting charging on a Zaptec charger are:
 - Native (starts charging immediately upon cable connected to car)
 - Native with permission (requires RFID and/or app - meaning manual start)
 - Webhook auth (can be with RFID and/or Authentication)
 - Webhook auth (only URL) <- THIS REPOSITORY
 - OCPP-J 1.6 (there is a custom component directory in HA, _should work_, but haven't got it to work)

This container allows us to call an URL to start charging on demand, i.e. when electricity prices are low.
We can start it from Home Assistant.
The URL is just responding with a start command according to zaptec API.
More info at https://zaptec.com/downloads/ZapChargerPro_Integration.pdf

Main reasons for using a docker container instead of a custom component for HA:
 - Not familiar enough in python
 - Can expose the external url fully (read only), instead of limiting access (my HA instance has an ip-allowlist)

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

Remember to add an automation to turn it off!

In Zaptec Portal UI add the public URLs:

![alt text](https://github.com/gustafssone/zaptecwebhook/blob/main/zaptecportal.png?raw=true)

E.g:

Start:

https://zaptec.mydomain.com/external/djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf/start

End:

https://zaptec.mydomain.com/external/djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf/end

Generate random ids for obfuscation instead of my examples
Start it with node for validation if you want:
```
INTID=ij2YChMgxNBTfQtH5Qv6U7oQPv2kdPnWgrjMs8iwKebkh5UVnnZ6UMdaNCMVunen EXTID=djS8b9wGb7Q6RyA8cUa4VtvHGFLUbAEp5rRWdfKX8Gs7h9uyssb95xk935L8tUwf node app.js
```

In this directory, a Dockerfile for building and a service example exists (I am using Docker Swarm).
Container at https://hub.docker.com/r/erikadvectas/zaptecwebhook 