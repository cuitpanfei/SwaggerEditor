package cn.com.pfinfo.blog;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


public class MyTest {
	public static void main(String args[]){
		String left="metric.reporters = \"[]\"      ,      metadata.max.age.ms = \"300000\"      ,      partition.assignment.strategy = \"[org.apache.kafka.clients.consumer.RangeAssignor]\"      ,      reconnect.backoff.ms = \"50\"      ,      sasl.kerberos.ticket.renew.window.factor = \"0.8\"      ,      max.partition.fetch.bytes = \"1048576\"      ,      bootstrap.servers = \"[5.0.0.63:9092, 5.0.0.64:9092, 5.0.0.65:9092]\"      ,      ssl.keystore.type = \"JKS\"      ,      enable.auto.commit = \"false\"      ,      sasl.mechanism = \"GSSAPI\"      ,      interceptor.classes = \"null\"      ,      exclude.internal.topics = \"true\"      ,      ssl.truststore.password = \"null\"      ,      client.id = \"consumer-6\"      ,      ssl.endpoint.identification.algorithm = \"null\"      ,      max.poll.records = \"1000\"      ,      check.crcs = \"true\"      ,      request.timeout.ms = \"150000\"      ,      heartbeat.interval.ms = \"15000\"      ,      auto.commit.interval.ms = \"600\"      ,      receive.buffer.bytes = \"65536\"      ,      ssl.truststore.type = \"JKS\"      ,      ssl.truststore.location = \"null\"      ,      ssl.keystore.password = \"null\"      ,      fetch.min.bytes = \"1\"      ,      send.buffer.bytes = \"131072\"      ,      value.deserializer = \"class org.apache.kafka.common.serialization.StringDeserializer\"      ,      group.id = \"iotcourtlocationds_fence\"      ,      retry.backoff.ms = \"100\"      ,      sasl.kerberos.kinit.cmd = \"/usr/bin/kinit\"      ,      sasl.kerberos.service.name = \"null\"      ,      sasl.kerberos.ticket.renew.jitter = \"0.05\"      ,      ssl.trustmanager.algorithm = \"PKIX\"      ,      ssl.key.password = \"null\"      ,      fetch.max.wait.ms = \"5000\"      ,      sasl.kerberos.min.time.before.relogin = \"60000\"      ,      connections.max.idle.ms = \"540000\"      ,      session.timeout.ms = \"30000\"      ,      metrics.num.samples = \"2\"      ,      key.deserializer = \"class org.apache.kafka.common.serialization.StringDeserializer\"      ,      ssl.protocol = \"TLS\"      ,      ssl.provider = \"null\"      ,      ssl.enabled.protocols = \"[TLSv1.2, TLSv1.1, TLSv1]\"      ,      ssl.keystore.location = \"null\"      ,      ssl.cipher.suites = \"null\"      ,      security.protocol = \"PLAINTEXT\"      ,      ssl.keymanager.algorithm = \"SunX509\"      ,      metrics.sample.window.ms = \"30000\"      ,      auto.offset.reset = \"latest\"";
		String right="auto.commit.interval.ms = \"5000\"      ,      auto.offset.reset = \"latest\"      ,      bootstrap.servers = \"[5.0.0.63:9092, 5.0.0.64:9092, 5.0.0.65:9092]\"      ,      check.crcs = \"true\"      ,      client.id = \"     ,      connections.max.idle.ms = \"540000\"      ,      enable.auto.commit = \"false\"      ,      exclude.internal.topics = \"true\"      ,      fetch.max.bytes = \"52428800\"      ,      fetch.max.wait.ms = \"500\"      ,      fetch.min.bytes = \"1\"      ,      group.id = \"iotbeadhouseds\"      ,      heartbeat.interval.ms = \"3000\"      ,      interceptor.classes = \"null\"      ,      key.deserializer = \"class org.apache.kafka.common.serialization.StringDeserializer\"      ,      max.partition.fetch.bytes = \"1048576\"      ,      max.poll.interval.ms = \"300000\"      ,      max.poll.records = \"100\"      ,      metadata.max.age.ms = \"300000\"      ,      metric.reporters = \"[]\"      ,      metrics.num.samples = \"2\"      ,      metrics.sample.window.ms = \"30000\"      ,      partition.assignment.strategy = \"[class org.apache.kafka.clients.consumer.RangeAssignor]\"      ,      receive.buffer.bytes = \"65536\"      ,      reconnect.backoff.ms = \"50\"      ,      request.timeout.ms = \"305000\"      ,      retry.backoff.ms = \"100\"      ,      sasl.kerberos.kinit.cmd = \"/usr/bin/kinit\"      ,      sasl.kerberos.min.time.before.relogin = \"60000\"      ,      sasl.kerberos.service.name = \"null\"      ,      sasl.kerberos.ticket.renew.jitter = \"0.05\"      ,      sasl.kerberos.ticket.renew.window.factor = \"0.8\"      ,      sasl.mechanism = \"GSSAPI\"      ,      security.protocol = \"PLAINTEXT\"      ,      send.buffer.bytes = \"131072\"      ,      session.timeout.ms = \"10000\"      ,      ssl.cipher.suites = \"null\"      ,      ssl.enabled.protocols = \"[TLSv1.2, TLSv1.1, TLSv1]\"      ,      ssl.endpoint.identification.algorithm = \"null\"      ,      ssl.key.password = \"null\"      ,      ssl.keymanager.algorithm = \"SunX509\"      ,      ssl.keystore.location = \"null\"      ,      ssl.keystore.password = \"null\"      ,      ssl.keystore.type = \"JKS\"      ,      ssl.protocol = \"TLS\"      ,      ssl.provider = \"null\"      ,      ssl.secure.random.implementation = \"null\"      ,      ssl.trustmanager.algorithm = \"PKIX\"      ,      ssl.truststore.location = \"null\"      ,      ssl.truststore.password = \"null\"      ,      ssl.truststore.type = \"JKS\"      ,      value.deserializer = \"class org.apache.kafka.common.serialization.StringDeserializer\"";
		Map<String,String> leftSet = new HashMap<String,String>();
		Map<String,String> rightSet = new HashMap<String,String>();
		Arrays.stream(left.split("      ,      ")).forEach(str->{
			String[] arrs=str.split("=");
			leftSet.put(arrs[0].trim(), arrs[0].trim());
		});
		Arrays.stream(right.split("      ,      ")).forEach(str->{
			String[] arrs=str.split("=");
			rightSet.put(arrs[0].trim(), arrs[0].trim());
		});
		System.out.println("left more has:");
		leftSet.keySet().removeAll(rightSet.keySet());
		leftSet.forEach((lkey,lvalue)->{
			rightSet.forEach((rkey,rvalue)->{
				if(lkey.equals(rkey)&&!lvalue.equals(rvalue)){
					System.out.println(lkey+"value diff: "+lvalue+" <====> "+rvalue);
				}
			});
		});
	}

}
