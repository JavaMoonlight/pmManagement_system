package com.szcu.mms_gateway.filters;

import com.szcu.mms_base.Util.JwtUtil;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.RequestPath;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.AntPathMatcher;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class AuthGlobalFilter implements GlobalFilter, Ordered {

	List<String> excludePaths = new ArrayList<>(2);

	private final AntPathMatcher antPathMatcher = new AntPathMatcher();

	private final JwtUtil jwt = new JwtUtil();

	@Override
	public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
		excludePaths.add("/auth/login");
		excludePaths.add("/auth/register");
		ServerHttpRequest request = exchange.getRequest();
		RequestPath path = request.getPath();
		if(isExcluded(path.toString())){
			return chain.filter(exchange);
		}
		HttpHeaders headers = request.getHeaders();
		List<String> token = headers.get("Authorization");
		if(token == null || token.isEmpty()){
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
		}
		String username = null;
		try {
			Map<?, ?> map = jwt.ParseJwt(token.get(0));
			username = map.get("username").toString();
		}catch(Exception e){
			exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
			return exchange.getResponse().setComplete();
		}
		System.out.println("Username:" + username);
		String finalUsername = username;
		ServerWebExchange swe = exchange.mutate().request(builder -> builder.header("username", finalUsername)).build();
		return chain.filter(swe);
	}

	private boolean isExcluded(String path) {
		for(String pathPattern : excludePaths){
			if(antPathMatcher.match(pathPattern, path))
				return true;
		}
		return false;
	}

	@Override
	public int getOrder() {
		return 0;
	}
}
