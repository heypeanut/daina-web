"use client";

import React, { useState } from 'react';
import { apiClient } from '@/lib/api';

export function ApiTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testConnections = async () => {
    setIsLoading(true);
    setTestResult('开始测试API连接...\n');

    const results = [];

    // 测试1: 轮播图接口
    try {
      results.push('测试1: 轮播图接口');
      const bannerResponse = await apiClient.getBanners(3);
      results.push(`✅ 轮播图接口成功: ${JSON.stringify(bannerResponse, null, 2)}`);
    } catch (error) {
      results.push(`❌ 轮播图接口失败: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 测试2: 档口推荐接口
    try {
      results.push('\n测试2: 档口推荐接口');
      const boothResponse = await apiClient.getBoothRecommendations({
        type: 'booth_hot',
        pageSize: 5,
        limit: 5
      });
      results.push(`✅ 档口推荐接口成功: ${JSON.stringify(boothResponse, null, 2)}`);
    } catch (error) {
      results.push(`❌ 档口推荐接口失败: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 测试3: 商品推荐接口  
    try {
      results.push('\n测试3: 商品推荐接口');
      const productResponse = await apiClient.getProductRecommendations({
        type: 'product_hot',
        pageSize: 5,
        limit: 5
      });
      results.push(`✅ 商品推荐接口成功: ${JSON.stringify(productResponse, null, 2)}`);
    } catch (error) {
      results.push(`❌ 商品推荐接口失败: ${error instanceof Error ? error.message : String(error)}`);
    }

    // 测试4: 基本网络连通性
    try {
      results.push('\n测试4: 基本网络连通性');
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(baseUrl, { method: 'GET', mode: 'cors' });
      results.push(`✅ 基本连通性成功: status ${response.status}`);
    } catch (error) {
      results.push(`❌ 基本连通性失败: ${error instanceof Error ? error.message : String(error)}`);
    }

    setTestResult(results.join('\n'));
    setIsLoading(false);
  };

  const testSimpleRequest = async () => {
    setIsLoading(true);
    setTestResult('测试简单请求...\n');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      
      // 测试多个接口
      const testUrls = [
        `${baseUrl}/public/homepage/banners?limit=1`,
        `${baseUrl}/public/homepage/booth-recommendations?type=booth_hot&pageSize=2`,
        `${baseUrl}/public/homepage/product-recommendations?type=product_hot&pageSize=2`,
      ];
      
      for (const url of testUrls) {
        setTestResult(prev => prev + `\n---\n测试URL: ${url}\n`);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });

        setTestResult(prev => prev + `响应状态: ${response.status} ${response.statusText}\n`);
        
        if (response.ok) {
          const data = await response.json();
          setTestResult(prev => prev + `响应数据结构:\n${JSON.stringify(data, null, 2)}\n`);
          
          // 分析数据结构
          if (data.data) {
            setTestResult(prev => prev + `data字段类型: ${Array.isArray(data.data) ? '数组' : typeof data.data}\n`);
            if (data.data.rows) {
              setTestResult(prev => prev + `data.rows字段类型: ${Array.isArray(data.data.rows) ? '数组' : typeof data.data.rows}\n`);
            }
            if (data.data.list) {
              setTestResult(prev => prev + `data.list字段类型: ${Array.isArray(data.data.list) ? '数组' : typeof data.data.list}\n`);
            }
          }
        } else {
          const errorText = await response.text();
          setTestResult(prev => prev + `错误响应: ${errorText}\n`);
        }
      }
    } catch (error) {
      setTestResult(prev => prev + `请求失败: ${error instanceof Error ? error.message : String(error)}\n`);
      
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        setTestResult(prev => prev + `
可能的问题:
1. 后端服务未启动
2. 端口配置错误
3. CORS配置问题
4. 网络连接问题

请检查:
- 后端服务是否在 ${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'} 运行
- 是否配置了正确的CORS头
- .env.local 中的 NEXT_PUBLIC_API_BASE_URL 是否正确
        `);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">API连接测试</h1>
        
        <div className="space-y-4">
          <div>
            <p className="mb-2">当前API地址: <code className="bg-gray-200 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000'}</code></p>
          </div>

          <div className="space-x-4">
            <button
              onClick={testSimpleRequest}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? '测试中...' : '测试简单请求'}
            </button>
            
            <button
              onClick={testConnections}
              disabled={isLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? '测试中...' : '测试所有接口'}
            </button>
          </div>

          {testResult && (
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">测试结果:</h3>
              <pre className="text-sm overflow-auto bg-gray-50 p-3 rounded whitespace-pre-wrap">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}