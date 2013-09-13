package com.tt.game;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Stack;

public class ClassNameParser {
	
	private Stack<Stack<String>> extendStack = new Stack<Stack<String>>();
	private Stack<String> classNameStack = new Stack<String>();
	private Stack<Integer> posStack = new Stack<Integer>();
	
	public static void main(String[] args) {

		ClassNameParser parser = new ClassNameParser();
//		parser.parseDir(new File("./"));
		System.out.println("|---------------------------------------|");
		System.out.println("|        ClassNameParser                |");
		System.out.println("|        Author: Small                  |");
		System.out.println("|        Version: 1.0.0                 |");
		System.out.println("|---------------------------------------|");
		System.out.println("+++++++++++++Parse Start+++++++++++++++++");
		parser.parseDir(new File("/Users/small/WebstormProjects/123G/Game/src"));
		System.out.println("+++++++++++++Parse End+++++++++++++++++++");
	}
	
	public void parseDir(File file){
		if(file == null || file.isFile()) return;
		File[] files = file.listFiles();
		for(int i = 0; i < files.length; ++i){
			if(files[i].isDirectory()){
				this.parseDir(files[i]);
			}else if(files[i].isFile()){
				String name = files[i].getName();
				int index = name.lastIndexOf(".js");
				if(index <= 0) continue;
				this.parse(files[i].getPath());
			}
		}
	}
	
	public void writeFile(String file, String encoding, List<String> list, Map<Integer, String> posMap){
		if(posMap.size() == 0) return;
		System.out.println("Modify:  " + file);
		FileOutputStream out = null;
		try{
            out=new FileOutputStream(file);
            PrintWriter ps = new PrintWriter(new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file),encoding)));
//            PrintStream ps=new PrintStream(out);
    		for(int i = 0; i < list.size(); ++i){
    			ps.println(list.get(i));
    			if(i == 8){
    			}
    			if(posMap.get(i) != null) {
    				StringBuffer sb = new StringBuffer("    ");
    				sb.append("className : '").append(posMap.get(i).replaceAll("\\.", "_")).append("',");
    				ps.println(sb);
    			}
    		}
    		ps.close();
        } catch (FileNotFoundException e){
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} finally{
    		if(out != null)
				try {
					out.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
        }
	}
	
	public void parse(String file){
		Map<Integer, String> posMap = new HashMap<Integer, String>();
		List<String> list = new ArrayList<String>();

		BufferedReader reader = null; 
		try { 
			InputStream inputStream = new FileInputStream(file);
			String charsetName = GameUtils.getFileEncode(file);
			reader = new BufferedReader(new InputStreamReader(inputStream, charsetName)); 
//			reader = new BufferedReader(new FileReader(file)); 
			String readStr = null, tempStr = null; 
			Stack<String> braceStack = null;
			char c1 = '{';
			char c2 = '}';
			boolean hasClassName = false;
			int count = -1;
			boolean isCom = false, isToAdd = true;
			while ((readStr = reader.readLine()) != null){ 
				list.add(readStr);
				tempStr = readStr.trim();
				if(isToAdd && braceStack != null && braceStack.size() == 1) {
					isToAdd = false;
					posStack.push(count);
				}
				count++;
				if(isCom){
					if(tempStr.length() >= 2 && tempStr.indexOf("*/") == tempStr.length() - 2) isCom = false;
					continue;
				}else{
					if(tempStr.indexOf("/*") == 0){
						if(tempStr.length() >= 4 && tempStr.indexOf("*/") == tempStr.length() - 2) continue;
						isCom = true;
						continue;
					}
				}
				if(tempStr.indexOf("//") == 0) continue;
				int extendIndex = tempStr.indexOf(".extend(");
				if(extendIndex > 1){
					if(tempStr.indexOf("{") >= 0 && tempStr.indexOf("}") >= 0) {//TODO 特殊情况
						int fIndex = readStr.indexOf("{");
						int lIndex = readStr.lastIndexOf("}");
						String str = readStr.substring(fIndex + 1, lIndex);
						if(str.indexOf("className") < 0){
							StringBuffer sb = new StringBuffer();
							sb.append(readStr.substring(0, fIndex + 1));
							

							String str1 = tempStr.substring(0, extendIndex);
							int eIndex = str1.indexOf("=");
							int sIndex = str1.indexOf("var ");
							sIndex = sIndex >= 0 ? 3 : 0;
							String cn = str1.substring(sIndex, eIndex).trim().replaceAll("\\.", "_");

		    				sb.append("className : '").append(cn).append("'");
		    				if(str.trim().length() != 0) sb.append(",");
		    				sb.append(str).append(readStr.substring(lIndex));
		    				posMap.put(-1, "");
		    				list.remove(list.size() - 1);
							list.add(sb.toString());
						}
						continue;
					}
					isToAdd = true;
					braceStack = new Stack<String>();
					extendStack.push(braceStack);
					String str = tempStr.substring(0, extendIndex);
					int eIndex = str.indexOf("=");
					int sIndex = str.indexOf("var ");
					sIndex = sIndex >= 0 ? 3 : 0;
					classNameStack.push(str.substring(sIndex, eIndex).trim());
				}
				if(extendStack.size() == 0) {
					continue;
				}
				if(tempStr.indexOf("className") == 0) {
					hasClassName = true;
				}
				if(tempStr.indexOf("{") >= 0 || tempStr.indexOf("}") >= 0){
					char[] chars = tempStr.toCharArray();
					for(int i = 0; i < chars.length; i++){
						if(chars[i] == c1){
							braceStack.push("{");
						}
						else if(chars[i] == c2) {
							braceStack.pop();
							if(braceStack.size() == 0){//一个extend结束
								if(!hasClassName){
									int pos = posStack.pop();
									String className = classNameStack.pop();
									posMap.put(pos, className);
								}
								extendStack.pop();
								hasClassName = false;
								if(extendStack.size() == 0) break;
								braceStack = extendStack.lastElement();
							}
						}
					}
				}
			}
			reader.close(); 
			this.writeFile(file, charsetName, list, posMap);
			posStack.clear();
			classNameStack.clear();
			extendStack.clear();
		} catch (IOException e) { 
		e.printStackTrace(); 
		} finally { 
			if (reader != null){ 
				try { 
					reader.close(); 
				} catch (IOException e1) { 
				} 
			} 
		} 
	}
	

}
